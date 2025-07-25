import pickle
import re
import string
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import math

def preprocess_text(text, use_ngrams=False, ngrams_range=(1,1)):
    """
    Preprocesses text for offensive language detection, including:
    - Lowercasing
    - Negation handling (contraction expansion and 'not_' prefixing)
    - Punctuation and digit removal
    - Whitespace normalization
    - Tokenization
    - Smart stop word removal (retaining 'not', 'no', etc.)
    - N-gram generation (if use_ngrams is True)

    Args:
        text (str): The input text to preprocess.
        use_ngrams (bool): If True, generates n-grams based on ngrams_range.
        ngrams_range (tuple): A tuple (min_n, max_n) for n-gram generation.
                              (1,1) for unigrams only, (1,2) for unigrams and bigrams, etc.

    Returns:
        list: A list of processed tokens (and n-grams if enabled).
              Returns "Given input is not a string" if the input is not a string.
    """
    if not isinstance(text, str):
        return "Given input is not a string"
    
    # 1. Lowercasing and Negation Handling (Contraction Expansion)
    text = text.lower()
    text = re.sub(r"won't", "will not", text)
    text = re.sub(r"can't", "can not", text)
    text = re.sub(r"n't", " not", text) # Important: "don't" -> "do not", "isn't" -> "is not"
    text = re.sub(r"'re", " are", text)
    text = re.sub(r"'s", " is", text)
    text = re.sub(r"'d", " would", text)
    text = re.sub(r"'ll", " will", text)
    text = re.sub(r"'ve", " have", text)
    text = re.sub(r"'m", " am", text)

    # 2. Remove punctuation
    # Using the regex that only keeps alphabets and spaces, which also handles punctuation
    text = re.sub(r'[^a-zA-Z\s]', '', text)

    # 3. Remove digits from text (already done by previous regex if no numbers were preserved)
    text=re.sub(r"[0-9]+"," ",text)

    # 4. Remove multiple white spaces & strip leading/trailing whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # 5. Tokenize the text into words
    tokenize_word = word_tokenize(text)

    # 6. Removing stopwords with custom handling for negation words
    stop_words = set(stopwords.words('english'))
    # Ensure 'not' and 'no' are not treated as stop words, as they are crucial for negation.
    stop_words.discard('not')
    stop_words.discard('no')
    
    # Filter tokens: remove stop words, but KEEP all words regardless of length (len > 1 removed)
    filtered_tokens = [word for word in tokenize_word if word not in stop_words] 

    # 7. Apply 'not_' prefix for negation (after stop word removal)
    negation_words_for_prefixing = {'not', 'no'} # Words that trigger negation prefixing
    negated_tokens = []
    negate = False
    for token in filtered_tokens:
        if token in negation_words_for_prefixing:
            negate = True # Next word should be negated
            negated_tokens.append(token) # Keep the negation word itself
        elif negate:
            negated_tokens.append('not_' + token)
            negate = False # Reset negate flag after one word
        else:
            negated_tokens.append(token)
            
    # 8. N-gram Generation
    if use_ngrams:
        all_features = []
        for n in range(ngrams_range[0], ngrams_range[1] + 1):
            if n == 1:
                all_features.extend(negated_tokens) # Unigrams are the negated tokens
            elif n > 1:
                # Generate n-grams from the negated_tokens list
                for i in range(len(negated_tokens) - n + 1):
                    all_features.append("_".join(negated_tokens[i:i+n]))
        return all_features
    else:
        return negated_tokens # Return just negated unigrams if n-grams are not requested

def load_model_params(filename="naive_bayes_model_params.pkl"):
    """Load the trained model parameters from a file."""
    with open(filename, "rb") as f:
        data = pickle.load(f)
    # print(f"Model parameters loaded from {filename}")
    return (
        data["vocabulary"],
        data["idf_scores"],
        data["class_priors"],
        data["word_probabilities"],
        data["total_words_in_class"]
    )

def predict_single_blog(doc_tokens, vocabulary, class_priors, word_probabilities, total_words_in_class, smoothing_alpha=1.0):
    """
    Predicts the class label for a single document.
    doc_tokens: list of preprocessed tokens for the document.
    vocabulary: The global vocabulary (OrderedDict).
    class_priors: Dictionary of class prior probabilities.
    word_probabilities: Dictionary of word probabilities P(word | class).
    total_words_in_class: Dictionary of total word counts per class (for smoothing).
    smoothing_alpha: Laplace smoothing parameter.
    Returns: The predicted class label.
    """
    best_class = None
    max_log_posterior = -float('inf')

    for c, prior_prob in class_priors.items():
        # Use log probabilities to avoid underflow
        log_posterior = math.log(prior_prob)
        
        for word_token in doc_tokens:
            # Only consider words present in the training vocabulary
            if word_token in vocabulary:
                # Get P(word | class) for this word in this class
                word_prob = word_probabilities[c].get(word_token, smoothing_alpha / total_words_in_class[c])
                log_posterior += math.log(word_prob)

        if log_posterior > max_log_posterior:
            max_log_posterior = log_posterior
            best_class = c
    return best_class


def offensive(text):
    # Define the file path for your saved model parameters
    model_filename = "offensive.pkl"

    # Load the trained parameters
    try:
        vocabulary_loaded, idf_scores_loaded, class_priors_loaded, word_probabilities_loaded, total_words_in_class_loaded = load_model_params(model_filename)
        # print("Model parameters loaded successfully!")

        # Define the new blog content you want to predict
        new_blog_text = text
        # You should use the same n-gram settings as during training
        USE_NGRAMS_PREDICT = True # Set this to True if you trained with n-grams
        NGRAM_RANGE_PREDICT = (1, 2) # Set this to the range used during training

        # print(f"\nNew blog content: '{new_blog_text}'")

        # Preprocess the new blog text using the same function and settings
        processed_new_blog_tokens = preprocess_text(new_blog_text, use_ngrams=USE_NGRAMS_PREDICT, ngrams_range=NGRAM_RANGE_PREDICT)
        # print(f"Processed tokens for new blog: {processed_new_blog_tokens[:10]}...") # Show first few tokens

        # Make a prediction using the loaded parameters
        prediction_for_new_blog = predict_single_blog(
            processed_new_blog_tokens,
            vocabulary_loaded,
            class_priors_loaded,
            word_probabilities_loaded,
            total_words_in_class_loaded
        )

        # print(f"\nPredicted category for the new blog: {prediction_for_new_blog}")
        return prediction_for_new_blog

    except FileNotFoundError:
        return (f"Error: Model parameters file '{model_filename}' not found. Please ensure you have run the training pipeline and saved the model parameters.")
    except Exception as e:
        return (f"An error occurred while loading or predicting: {e}")