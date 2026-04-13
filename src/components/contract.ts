import * as Yup from "yup";

export interface IRegisterFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  address: string;
  image: File | null;
  password: string;
  confirmPassword: string;
}

export enum UserRoles{
  ADMIN='admin',
  DRIVER='driver',
  PASSENGER = 'passenger'
}

export enum Status{
  ACTIVE='active',
  INACTIVE='inactive',
}

export const RegisterDTO: Yup.ObjectSchema<IRegisterFormData> = Yup.object({
  name: Yup.string().required("Full name is required"),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),

  gender: Yup.string().required("Gender is required"),

  role: Yup.string()
    .required("Role is required")
    .oneOf(["admin", "user"], "Invalid role"),

  address: Yup.string(),

  image: Yup.mixed().nullable().optional(),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Minimum 6 characters required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
}) as Yup.ObjectSchema<IRegisterFormData>;
