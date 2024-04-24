import pandas as pd
import numpy as np
import wfdb
import ast
from typing import List, Set, Dict


def load_raw_data(path: str, sampling_rate: int, directory: str) -> np.ndarray:
    """
    Load raw ECG data from a file.

    Args:
        path (str): The file path.
        sampling_rate (int): The sampling rate of the data (e.g., 100 or 500).
        directory (str): The directory containing the data files.

    Returns:
        np.ndarray: The loaded ECG data as a numpy array.
    """
    if sampling_rate == 100:
        data = [wfdb.rdsamp(directory + path)]
    else:
        # Give the filename as hr_file if sample is 500
        data = [wfdb.rdsamp(directory + path)]
    data = np.array([signal for signal, meta in data], dtype=np.float32)
    return data[0]


def diagnostic(y_dic: Dict[str, bool]) -> Set[str]:
    """
    Extract diagnostic codes from the given dictionary.

    Args:
        y_dic (Dict[str, bool]): A dictionary containing diagnostic codes as keys and boolean values.

    Returns:
        Set[str]: A set of diagnostic codes that have True values.
    """
    tmp = set()
    for key in y_dic.keys():
        if y_dic[key]:
            tmp.add(key)
    return tmp


def process_data() -> pd.DataFrame:
    """
    Process the ECG data and return a DataFrame.

    Returns:
        pd.DataFrame: The processed DataFrame containing ECG data and diagnostic information.
    """
    path = 'time_series/data/ptb-xl-a-large-publicly-available-electrocardiography-dataset-1.0.1/'
    sampling_rate = 100

    # Remove number of rows limited to 10
    df = pd.read_csv(path + 'ptbxl_database.csv', index_col='ecg_id', nrows=5000)
    df.scp_codes = df.scp_codes.apply(lambda x: ast.literal_eval(x))

    # Load raw signal data
    df['ecg_data'] = df['filename_lr'].apply(lambda x: load_raw_data(x, sampling_rate, path))
    df['diagnostic_superclass'] = df.scp_codes.apply(diagnostic)
    return df







