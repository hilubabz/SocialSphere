import pickle
import re
import string
import numpy as np

def handle_negations(words):
    """
    Finds negation words and prefixes the following word with 'not_'.
    """
    negation_words = {"not", "no", "n't", "never"}
    processed_words = []
    i = 0
    while i < len(words):
        word = words[i]
        if word in negation_words or re.search(r'\w+n\'t$', word):
            if i + 1 < len(words):
                processed_words.append('not_' + words[i+1])
                i += 2
            else:
                processed_words.append(word)
                i += 1
        else:
            processed_words.append(word)
            i += 1
    return processed_words

def preprocess_text(text):
    """
    Simple preprocessing function to lowercase and tokenize text with negation handling.
    """
    # Lowercase and remove punctuation, but keep apostrophes
    punctuation_to_remove = string.punctuation.replace("'", "")
    processed_text = text.lower().translate(str.maketrans('', '', punctuation_to_remove))
    # Split into words (simple tokenization)
    words = processed_text.split()
    # Handle negations
    return handle_negations(words)

# Logistic Regression Model Class (from the previous notebook)
class LogisticRegression:
    def __init__(self, weights, bias):
        self.w = weights
        self.b = bias

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-z))

    def predict(self, X):
        linear_model = np.dot(X, self.w) + self.b
        y_predicted = self.sigmoid(linear_model)
        y_predicted_cls = [1 if i > 0.5 else 0 for i in y_predicted]
        return np.array(y_predicted_cls)

def custom_tfidf_vectorizer_transform(tweets, vocabulary, idf_scores):
    """
    Transforms text data into a TF-IDF matrix based on a given vocabulary and IDF scores.
    """
    X = np.zeros((len(tweets), len(vocabulary)))
    for i, tweet in enumerate(tweets):
        words = preprocess_text(tweet)
        doc_word_counts = {}
        for word in words:
            if word in vocabulary:
                doc_word_counts[word] = doc_word_counts.get(word, 0) + 1

        if sum(doc_word_counts.values()) > 0:
            for word, count in doc_word_counts.items():
                tf = count / sum(doc_word_counts.values())
                tfidf = tf * idf_scores.get(word, 0)
                X[i, vocabulary[word]] = tfidf
    return X

def predict_offensive_comment(text, model_path='logistic_regression_tfidf.pkl'):
    """Predicts the class of a new comment using the trained TF-IDF based Logistic Regression model."""
    # Load model parameters and TF-IDF data
    with open(model_path, 'rb') as f:
        data = pickle.load(f)
        weights = data['weights']
        bias = data['bias']
        vocabulary = data['vocabulary']
        idf_scores = data['idf_scores']

    # Instantiate the Logistic Regression model with the loaded parameters
    model = LogisticRegression(weights, bias)

    # Vectorize the new comment using the loaded vocabulary and TF-IDF scores
    X_new = custom_tfidf_vectorizer_transform([text], vocabulary, idf_scores)

    # Predict the class
    prediction = model.predict(X_new)[0]

    return 'offensive' if prediction == 1 else 'not_offensive'