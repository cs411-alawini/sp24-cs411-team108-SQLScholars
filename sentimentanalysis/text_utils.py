from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import nltk
nltk.download('punkt')
nltk.download('stopwords')

stemmer = PorterStemmer()

def tokenize_and_stem(text):
    tokens = [word for word in word_tokenize(text.lower()) if word.isalpha()]
    filtered_tokens = [stemmer.stem(token) for token in tokens if token not in stopwords.words('english')]
    return filtered_tokens