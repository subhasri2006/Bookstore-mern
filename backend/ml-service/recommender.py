from pymongo import MongoClient
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
# MongoDB Connection
client = MongoClient("mongodb://subhasri4844_db_user:subha123@ac-6dy3kyo-shard-00-00.ldypqri.mongodb.net:27017,ac-6dy3kyo-shard-00-01.ldypqri.mongodb.net:27017,ac-6dy3kyo-shard-00-02.ldypqri.mongodb.net:27017/?ssl=true&replicaSet=atlas-sg3q2v-shard-0&authSource=admin&appName=Cluster0 ")

db = client["test"]

# Fetch Books
books = list(db.books.find())

print(f"Found {len(books)} books")

df = pd.DataFrame(books)

# Handle missing values
df["title"] = df["title"].fillna("")
df["author"] = df["author"].fillna("")
df["category"] = df["category"].fillna("")
df["description"] = df["description"].fillna("")

# Combine all text fields
df["combined_text"] = (
    df["title"] + " " +
    df["author"] + " " +
    df["author"] + " " +
    df["category"] + " " +
    df["category"] + " " +
    df["category"] + " " +
    df["description"]
)

# TF-IDF
vectorizer = TfidfVectorizer(stop_words="english")

tfidf_matrix = vectorizer.fit_transform(df["combined_text"])
similarity_matrix = cosine_similarity(tfidf_matrix)

print("Similarity Matrix Shape:", similarity_matrix.shape)
print("TF-IDF Matrix Shape:", tfidf_matrix.shape)
def recommend_book(book_title):
    try:
        idx = df[df["title"] == book_title].index[0]

        scores = list(enumerate(similarity_matrix[idx]))

        scores = sorted(
            scores,
            key=lambda x: x[1],
            reverse=True
        )

        recommendations = scores[1:6]

        print(f"\nRecommendations for '{book_title}':\n")

        for i, score in recommendations:
            print(
                f"{df.iloc[i]['title']} "
                f"(Similarity: {score:.2f})"
            )

    except Exception as e:
        print("Error:", e)
recommend_book("How to think like Steve Jobs")