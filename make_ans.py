import json
import math
from collections import OrderedDict

a = []
for i in range(0,100):
  x = math.cos(math.pi/10 * i)
  y = math.sin(math.pi/10 * i)
  b = OrderedDict()
  b["time"] = float(i);
  b["x"] = 5*x;
  b["y"] = 5*y;
  a.append(b);

print(json.dumps(a))