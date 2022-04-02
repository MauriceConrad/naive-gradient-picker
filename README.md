# Naive UI Gradient Picker

![Preview](https://raw.githubusercontent.com/MauriceConrad/naive-gradient-picker/main/resources/preview.png)

```bash
$ npm install naive-gradient-picker
```

### Basic usage

**Template**

```html
<n-gradient-picker v-model:value="gradient" />
```

**Script**

```javascript
import NGradientPicker from 'naive-gradient-picker'

const gradient = ref(`linear-gradient(to right, blue, red, green)`);
```


### Naive Angle Thumb

Aside the `<n-gradient-picker>` component, you can also use the `<n-angle-thumb>` component if you want to use the angle thumb used within the gradient picker on its own.

**Template**

```html
<n-angle-thumb v-model:value="angle" :min="0" :max="360" :step="1" :grid="[0, 90, 180, 270, 360]" />
```

**Script**

```javascript
import { NAngleThumb } from 'naive-gradient-picker'

const angle = ref(90);
```