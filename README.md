# Naive UI Gradient Picker

![Preview](https://raw.githubusercontent.com/MauriceConrad/naive-gradient-picker/main/resources/preview.png)

```bash
$ npm install naive-gradient-picker
```

### Basic usage

The `<n-gradient-picker>` component models any valid CSS gradient value (e.g. `linear-gradient(90deg, #fff, #00f 30%, #f00)`).

**Template**

```html
<n-gradient-picker v-model:value="gradient" size="medium" />
```

#### Size

The size can have the following values: `tiny`, `small`, `medium` or `large`.

**Script**

```javascript
// Import component
import NGradientPicker from 'naive-gradient-picker'
// Import component's style
import 'naive-gradient-picker/style.css'

// Initialize a reactive gradient string 
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
// Import component
import { NAngleThumb } from 'naive-gradient-picker'
// Import component's style
import 'naive-gradient-picker/style.css'

// Initialize a reactive angle 
const angle = ref(90);
```