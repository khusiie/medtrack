import argparse
import pandas as pd
import numpy as np
from resnet import Resnet
from data_preprocessing import process_data
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer


def read_data():
    """
    Read and preprocess the ECG data.

    Returns:
        tuple: A tuple containing the train and test data along with the classes.
               (X_train, X_test, y_train, y_test, classes)
    """
    print("Reading Data...")
    data = process_data()
    print("Process Completed")
    X = data["ecg_data"]
    Y = data["diagnostic_superclass"]

    # Create an instance of MultiLabelBinarizer
    mlb = MultiLabelBinarizer()

    # Fit and transform the column containing lists
    one_hot_encoded = mlb.fit_transform(Y)
    one_hot_encoded = one_hot_encoded.astype(np.float32)

    # Create a new DataFrame from the one-hot encoded array
    Y_encoded = pd.DataFrame(one_hot_encoded, columns=mlb.classes_)
    X_train, X_test, y_train, y_test = train_test_split(
        X, Y_encoded, test_size=0.2, random_state=42
    )
    return X_train, X_test, y_train, y_test, mlb.classes_


def main(output_directory: str = "model/"):
    """
    Main function to train the ResNet model on ECG data.

    Args:
        output_dir (str, optional): Path to the output model directory. Default is "output_model".
        :param output_directory:
    """
    X_train, X_test, y_train, y_test, classes = read_data()

    print("Converting the shape from (8,) to (8,1000,12)")
    X_train = np.stack(X_train)
    X_test = np.stack(X_test)

    input_shape = [1000, 12]
    n_classes = len(classes)
    print(classes)
    resnet_model = Resnet(output_directory, input_shape, n_classes)
    model = resnet_model.build_model(input_shape, n_classes)
    train_result = resnet_model.fit(X_train, y_train, X_test, y_test)

    print(train_result)  # This will print the training completion message and duration


if __name__ == "__main__":
    # parser = argparse.ArgumentParser(description="Train the ResNet model on ECG data.")
    # parser.add_argument("--output-dir", required=True, help="Path to the output model directory.")
    # args = parser.parse_args()

    # main(args.output_dir)
    main()
