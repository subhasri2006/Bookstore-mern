from pymongo import MongoClient
import pandas as pd

client = MongoClient("mongodb://subhasri4844_db_user:subha123@ac-6dy3kyo-shard-00-00.ldypqri.mongodb.net:27017,ac-6dy3kyo-shard-00-01.ldypqri.mongodb.net:27017,ac-6dy3kyo-shard-00-02.ldypqri.mongodb.net:27017/?ssl=true&replicaSet=atlas-sg3q2v-shard-0&authSource=admin&appName=Cluster0 ")

db = client["test"]

books = list(db.books.find())

print(f"Found {len(books)} books")

df = pd.DataFrame(books)

print(df[["title", "author", "category"]].head())