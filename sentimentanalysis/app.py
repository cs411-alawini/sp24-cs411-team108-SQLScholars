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
    data = request.get_json(force=True)
    text = data['text']
    print(text)
    txt = pd.Series(text)
    pred = model.predict(txt)
    response = jsonify({'prediction': int(pred[0])})
    return response

if __name__ == '__main__':
    app.run(port=5000, debug=True)

