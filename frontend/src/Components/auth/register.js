import { useForm, FormProvider, Controller } from "react-hook-form";
import { Button } from './button';
import { Input } from './input';
import axios from 'axios';
import * as React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import './form.css';

// Schéma de validation du formulaire avec validation des mots de passe
const formSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(30, 'Name must be at most 30 characters'),
  email: z.string()
    .email('Invalid email address')
    .min(8, 'Email must be at least 8 characters')
    .max(30, 'Email must be at most 30 characters'),
  password: z.string()
    .min(5, 'Password must be at least 5 characters')
    .max(17, 'Password must be at most 17 characters'),
  confirmPassword: z.string()
    .min(5, 'Password must be at least 5 characters')
    .max(17, 'Password must be at most 17 characters'),
  profile: z.any().optional()
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Passwords don't match",
});

export function Register() {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profile: undefined
    },
  });

  const navigate = useNavigate(); 
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');

    // Préparation des données du formulaire pour un envoi en multipart/form-data
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);
    if (values.profile) {
      formData.append('profile', values.profile);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/register', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      navigate('/login'); // Redirige vers la page de login après une inscription réussie
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setError('Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <div className="register-form-header">
          <h1>Register Now</h1>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="register-form-space-y-8">
            <div className="register-form-item">
              <label htmlFor="name">Your Name <span>*</span></label>
              <Controller
                name="name"
                control={methods.control}
                render={({ field }) => (
                  <Input id="name" placeholder="Enter your name" {...field} />
                )}
              />
              {methods.formState.errors.name && (
                <p className="register-error-message">{methods.formState.errors.name.message}</p>
              )}
            </div>
            <div className="register-form-item">
              <label htmlFor="email">Your Email <span>*</span></label>
              <Controller
                name="email"
                control={methods.control}
                render={({ field }) => (
                  <Input id="email" placeholder="Enter your email" {...field} />
                )}
              />
              {methods.formState.errors.email && (
                <p className="register-error-message">{methods.formState.errors.email.message}</p>
              )}
            </div>
            <div className="register-form-item">
              <label htmlFor="password">Your Password <span>*</span></label>
              <Controller
                name="password"
                control={methods.control}
                render={({ field }) => (
                  <Input id="password" type="password" placeholder="Enter your password" {...field} />
                )}
              />
              {methods.formState.errors.password && (
                <p className="register-error-message">{methods.formState.errors.password.message}</p>
              )}
            </div>
            <div className="register-form-item">
              <label htmlFor="confirmPassword">Confirm Password <span>*</span></label>
              <Controller
                name="confirmPassword"
                control={methods.control}
                render={({ field }) => (
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" {...field} />
                )}
              />
              {methods.formState.errors.confirmPassword && (
                <p className="register-error-message">{methods.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="register-form-item">
              <label htmlFor="profile">Select Profile</label>
              <Controller
                name="profile"
                control={methods.control}
                render={({ field }) => (
                  <Input id="profile" type="file" {...field} />
                )}
              />
              {methods.formState.errors.profile && (
                <p className="register-error-message">{methods.formState.errors.profile.message}</p>
              )}
            </div>
            {error && <p className="register-error-message">{error}</p>}
            <div className="register-form-button">
              <Button type="submit" disabled={loading}>
                {loading ? <div className="register-loader"></div> : 'Register'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default Register;
