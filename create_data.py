import numpy as np

shape = 3000, 3000

scalar = np.random.rand(*shape)
np.save('./data/scalar.npy', scalar)

image = np.zeros((shape[0], shape[1], 3), dtype=np.uint8)
image[..., 0] = image[..., 1] = image[..., 2] = 255*scalar
np.save('./data/image.npy', image)

mask = (scalar > .5)
np.save('./data/mask.npy', mask)
