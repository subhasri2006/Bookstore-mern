from flask import Flask, jsonify
from pymongo import MongoClient
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# MongoDB
client = MongoClient("mongodb://subhasri4844_db_user:subha123@ac-6dy3kyo-shard-00-00.ldypqri.mongodb.net:27017,ac-6dy3kyo-shard-00-01.ldypqri.mongodb.net:27017,ac-6dy3kyo-shard-00-02.ldypqri.mongodb.net:27017/?ssl=true&replicaSet=atlas-sg3q2v-shard-0&authSource=admin&appName=Cluster0 ")
db = client["test"]

# Load Books
books = list(db.books.find())

df = pd.DataFrame(books)

df["title"] = df["title"].fillna("")
df["author"] = df["author"].fillna("")
df["category"] = df["category"].fillna("")
df["description"] = df["description"].fillna("")

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

# Cosine Similarity
similarity_matrix = cosine_similarity(tfidf_matrix)


@app.route("/")
def home():
    return "ML Recommendation Service Running"


@app.route("/recommend/<book_id>")
def recommend(book_id):
    try:
        idx = df[df["_id"].astype(str) == book_id].index[0]

        scores = list(enumerate(similarity_matrix[idx]))

        scores = sorted(
            scores,
            key=lambda x: x[1],
            reverse=True
        )[1:6]

        recommendations = []

        for i, score in scores:
            recommendations.append({
                "_id": str(df.iloc[i]["_id"]),
                "title": df.iloc[i]["title"],
                "author": df.iloc[i]["author"],
                "image": df.iloc[i]["image"],
                "price": df.iloc[i]["price"],
                "similarity": round(float(score), 3)
            })

        return jsonify(recommendations)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)