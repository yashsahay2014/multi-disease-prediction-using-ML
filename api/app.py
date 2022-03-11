from flask import Flask
from utils import Utils

import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, World!"
    
if __name__ == "__main__":
    utils = Utils()
    app.run(debug=True)
