import pandas as pd
import numpy as np
import re
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report

# Load dataset
df = pd.read_csv('train.csv')  # Ensure 'train.csv' is in the same directory as this script

# Basic tokenizer
def tokenize(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text.split()

# Build vocabulary
print("Available columns in the dataset:", df.columns.tolist())
# Replace 'text' with the actual column name containing the text data if different
texts = df[df.columns[0]].astype(str).tolist()  # Assumes the first column is the text column
tokenized_texts = [tokenize(text) for text in texts]
vocab = set(word for tokens in tokenized_texts for word in tokens)
word2idx = {word: idx for idx, word in enumerate(vocab)}

# Initialize random word embeddings
embedding_dim = 50
word_embeddings = np.random.uniform(-1, 1, (len(vocab), embedding_dim))

# Convert texts to averaged word embeddings
def text_to_vector(tokens):
    vectors = [word_embeddings[word2idx[word]] for word in tokens if word in word2idx]
    if vectors:
        return np.mean(vectors, axis=0)
    else:
        return np.zeros(embedding_dim)

X = np.array([text_to_vector(tokens) for tokens in tokenized_texts])

# Encode labels
label_encoder = LabelEncoder()
if 'class' not in df.columns:
    raise ValueError("The dataset must contain a 'class' column.")
y = label_encoder.fit_transform(df['class'])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train classifier
clf = LogisticRegression(max_iter=1000)
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
print("Classification Report:\n")
print(classification_report(y_test, y_pred, target_names=[str(cls) for cls in label_encoder.classes_]))
# Show some example predictions on the test set
print("\nSample predictions on test set:")
for i in range(5):
    idx = np.random.randint(0, len(X_test))
    sample_text = texts[X_train.shape[0] + idx] if (X_train.shape[0] + idx) < len(texts) else texts[idx]
    true_label = label_encoder.inverse_transform([y_test[idx]])[0]
    pred_label = label_encoder.inverse_transform([y_pred[idx]])[0]
    print(f"Text: {sample_text[:80]}...")
    print(f"True: {true_label} | Predicted: {pred_label}\n")
# Predict for user input
def predict_user_input(text):
    tokens = tokenize(text)
    vec = text_to_vector(tokens).reshape(1, -1)
    pred = clf.predict(vec)[0]
    label = label_encoder.inverse_transform([pred])[0]
    return label

# Test with input
while True:
    user_input = input("\nEnter your text (or 'exit' to quit): ")
    if user_input.lower() == 'exit':
        break
    prediction = predict_user_input(user_input)
    print(f"Predicted Category: {prediction}")
