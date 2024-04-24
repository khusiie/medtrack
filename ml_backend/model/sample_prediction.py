import numpy as np
import json
import tensorflow as tf
from model.data_preprocessing import load_raw_data

path = 'sample_data/'
sampling_rate = 100


class ECG:
    def __init__(self, model_path="model/model/best_model.hdf5"):
        self.ecg_model = tf.keras.models.load_model(model_path)
        self.path = "knowledge_source"
        with open('model/labels.json', 'r') as f:
            labels = json.load(f)
        self.labels = labels

    def predict(self, file_name, file_path, sampling_rate=100):
        ecg_data = load_raw_data(file_name, sampling_rate, file_path)
        ecg_data = np.expand_dims(ecg_data, axis=0)
        model_prediction = self.ecg_model.predict(ecg_data)
        predictions = self._postprocessing(model_prediction)
        return predictions[0]

    def _postprocessing(self, predictions):
        masked_arr = (predictions > 0.5).astype(int)
        masked_arr = masked_arr[0]
        labels_text = list(self.labels.values())
        result_list = [labels_text[i] for i in range(len(masked_arr)) if masked_arr[i] == 1]
        return result_list


if __name__ == "__main__":
    ecg = ECG()
    response = ecg.predict(file_name="00017_lr", file_path="sample_data/")
    print(response)
