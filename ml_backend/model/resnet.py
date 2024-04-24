import keras.layers
import tensorflow as tf
import time
from typing import Tuple


class Resnet:
    def __init__(
            self,
            output_directory: str,
            input_shape: Tuple[int, int],
            n_classes: int,
            verbose: bool = False,
            build: bool = True,
            load_weights: bool = False,
    ):
        self.callbacks = None
        self.output_directory = output_directory
        if build:
            self.model = self.build_model(input_shape, n_classes)
            if verbose:
                self.model.summary()
            self.verbose = verbose
            if load_weights:
                self.model.load_weights(self.output_directory + "model_init.h5")
        return

    def build_model(self, input_shape, n_classes):
        n_features_maps = 64
        input_layer = tf.keras.layers.Input(input_shape)

        # BLOCK 1
        conv_x = tf.keras.layers.Conv1D(
            filters=n_features_maps, kernel_size=8, padding="same"
        )(input_layer)
        conv_x = tf.keras.layers.BatchNormalization()(conv_x)
        conv_x = tf.keras.layers.Activation("relu")(conv_x)

        conv_y = tf.keras.layers.Conv1D(
            filters=n_features_maps, kernel_size=5, padding="same"
        )(conv_x)
        conv_y = tf.keras.layers.BatchNormalization()(conv_y)
        conv_y = tf.keras.layers.Activation("relu")(conv_y)

        conv_z = tf.keras.layers.Conv1D(
            filters=n_features_maps, kernel_size=3, padding="same"
        )(conv_y)
        conv_z = tf.keras.layers.BatchNormalization()(conv_z)

        # Expand Channels for the sum
        shortcut_y = tf.keras.layers.Conv1D(
            filters=n_features_maps, kernel_size=1, padding="same"
        )(input_layer)
        shortcut_y = tf.keras.layers.BatchNormalization()(shortcut_y)

        output_block_1 = tf.keras.layers.add([shortcut_y, conv_z])
        output_block_1 = tf.keras.layers.Activation("relu")(output_block_1)

        # BLOCK 2
        conv_x = tf.keras.layers.Conv1D(
            filters=n_features_maps * 2, kernel_size=8, padding="same"
        )(output_block_1)
        conv_x = tf.keras.layers.BatchNormalization()(conv_x)
        conv_x = tf.keras.layers.Activation("relu")(conv_x)

        conv_y = tf.keras.layers.Conv1D(
            filters=n_features_maps * 2, kernel_size=5, padding="same"
        )(conv_x)
        conv_y = tf.keras.layers.BatchNormalization()(conv_y)
        conv_y = tf.keras.layers.Activation("relu")(conv_y)

        conv_z = tf.keras.layers.Conv1D(
            filters=n_features_maps * 2, kernel_size=3, padding="same"
        )(conv_y)
        conv_z = tf.keras.layers.BatchNormalization()(conv_z)

        # Expand Channels for the sum
        shortcut_y = tf.keras.layers.Conv1D(
            filters=n_features_maps * 2, kernel_size=1, padding="same"
        )(output_block_1)
        shortcut_y = tf.keras.layers.BatchNormalization()(shortcut_y)

        output_block_2 = keras.layers.add([shortcut_y, conv_z])
        output_block_2 = keras.layers.Activation("relu")(output_block_2)

        # BLOCK 3

        conv_x = tf.keras.layers.Conv1D(
            filters=n_features_maps * 2, kernel_size=8, padding="same"
        )(output_block_2)
        conv_x = tf.keras.layers.BatchNormalization()(conv_x)
        conv_x = tf.keras.layers.Activation("relu")(conv_x)

        conv_y = tf.keras.layers.Conv1D(
            filters=n_features_maps * 2, kernel_size=5, padding="same"
        )(conv_x)
        conv_y = tf.keras.layers.BatchNormalization()(conv_y)
        conv_y = tf.keras.layers.Activation("relu")(conv_y)

        conv_z = tf.keras.layers.Conv1D(
            filters=n_features_maps * 2, kernel_size=3, padding="same"
        )(conv_y)
        conv_z = tf.keras.layers.BatchNormalization()(conv_z)

        # no need to expand channels because they are equal
        shortcut_y = tf.keras.layers.BatchNormalization()(output_block_2)

        output_block_3 = tf.keras.layers.add([shortcut_y, conv_z])
        output_block_3 = tf.keras.layers.Activation("relu")(output_block_3)

        gap_layer = tf.keras.layers.GlobalAveragePooling1D()(output_block_3)
        output_layer = tf.keras.layers.Dense(n_classes, activation="softmax")(gap_layer)

        model = tf.keras.models.Model(inputs=input_layer, outputs=output_layer)
        # Chose recall to minimize false negative
        model.compile(
            loss="binary_crossentropy",
            optimizer=tf.keras.optimizers.Adam(),
            metrics=[tf.keras.metrics.Recall()],
        )

        reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
            monitor="loss", factor=0.5, patience=50, min_lr=0.0001
        )

        file_path = self.output_directory + "best_model.hdf5"

        model_checkpoint = tf.keras.callbacks.ModelCheckpoint(
            filepath=file_path, monitor="loss", save_best_only=True
        )
        self.callbacks = [reduce_lr, model_checkpoint]
        return model

    def fit(self, x_train, y_train, x_val, y_val):
        batch_size = 16
        nb_epochs = 30

        mini_batch_size = int(min(x_train.shape[0] / 10, batch_size))

        start_time = time.time()

        with tf.device("/gpu:0"):
            hist = self.model.fit(
                x_train,
                y_train,
                batch_size=mini_batch_size,
                epochs=nb_epochs,
                verbose=self.verbose,
                validation_data=(x_val, y_val),
                callbacks=self.callbacks,
            )
            print(hist.history)

        duration = time.time() - start_time

        self.model.save(self.output_directory + "last_model.hdf5")

        return f"Training Finished {duration}"

    def predict(self, x_test):
        start_time = time.time()
        model_path = self.output_directory + "best_model.hdf5"
        model = tf.keras.models.load_model(model_path)
        y_pred = model.predict(x_test)
        test_duration = time.time() - start_time
        return y_pred, test_duration
