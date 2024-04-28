import joblib
import numpy as np
from flask import Flask, request, jsonify
import pandas as pd
from joblib import load
from text_utils import tokenize_and_stem

app = Flask(__name__)
model=load('svm_pipeline.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    text = request.args.get('text')
    print(text)
    txt = pd.Series(text)
    pred = model.predict(txt)
    response = jsonify({'prediction': int(pred[0])})
    return response

@app.route('/', methods=['GET'])
def predict_get():
    return 'Hello World'

if __name__ == '__main__':
    app.run(port=5000)

