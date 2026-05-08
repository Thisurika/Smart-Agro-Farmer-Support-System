import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
});

export const signupSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(50, 'First name is too long'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(50, 'Last name is too long'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: Yup.string()
    .matches(/^[0-9+-\s]*$/, 'Invalid phone number format')
    .nullable(),
  address: Yup.string().nullable(),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(50, 'First name is too long'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(50, 'Last name is too long'),
  phone: Yup.string()
    .matches(/^[0-9+-\s]*$/, 'Invalid phone number format')
    .nullable(),
  address: Yup.string().nullable(),
});

export const cropSchema = Yup.object().shape({
  name: Yup.string()
    .required('Crop name is required')
    .trim(),
  description: Yup.string()
    .required('Description is required'),
  category: Yup.string()
    .oneOf(["Grains", "Vegetables", "Fruits", "Pulses", "Oilseeds", "Spices", "Cash Crops", "Other"], 'Invalid category')
    .required('Category is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .required('Price is required')
    .positive('Price must be positive'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative'),
  unit: Yup.string()
    .oneOf(["kg", "ton", "lb", "unit"], 'Invalid unit')
    .required('Unit is required'),
});

export const chemicalSchema = Yup.object().shape({
  name: Yup.string()
    .required('Chemical name is required')
    .trim(),
  description: Yup.string()
    .required('Description is required'),
  type: Yup.string()
    .oneOf(["Fertilizer", "Pesticide", "Herbicide", "Fungicide", "Insecticide", "Growth Regulator", "Other"], 'Invalid type')
    .required('Type is required'),
  category: Yup.string()
    .matches(/^[^0-9]*$/, 'Category cannot contain numbers')
    .required('Category is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .required('Price is required')
    .positive('Price must be positive'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative'),
  unit: Yup.string()
    .oneOf(["litre", "kg", "ml", "g", "unit"], 'Invalid unit')
    .required('Unit is required'),
});
export const feedbackSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .trim(),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters'),
  rating: Yup.number()
    .min(1, 'Please provide a rating (1-5)')
    .max(5, 'Rating cannot exceed 5')
    .required('Rating is required'),
});
