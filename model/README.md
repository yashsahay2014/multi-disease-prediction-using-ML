
# Understanding the code

Explanation of different sections of the codebase used in this project.

## Sections of code
- `Data Scraping.py`

The dataset used in this project was scrapped from [NHP](https://www.nhp.gov.in/disease-a-z) and Wikipedia Infobox.

- `Pre-process.py`

The raw dataset fetched above was pre-processed and cleaned.

- `Symptom matching.py`

To make the dataset more precise, synonyms of symptoms were scrapped from [Thesaurus](https://www.thesaurus.com/browse/synonym) and [Wordnet](https://www.nltk.org/howto/wordnet.html), cleaned and appended to the dataset.

- `Models.py`

The final dataset obtained above was fed into multiple ML classifier models.

- `Disease Predictor.py`

The main syptom based multi-disease prediction code. 

- `Treatment.py`

Shows more details about the top fetched diseases including their diagnostic methods, prevention and treatment. 
