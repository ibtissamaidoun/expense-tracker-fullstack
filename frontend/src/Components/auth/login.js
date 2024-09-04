import { useForm, FormProvider, Controller } from "react-hook-form";
import axios from 'axios';
import * as React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

// Schéma de validation du formulaire
const formSchema = z.object({
    email: z.string()
      .email('Invalid email address')
      .min(8, 'Email must be at least 8 characters')
      .max(30, 'Email must be at most 30 characters'),
    password: z.string()
      .min(5, 'Password must be at least 5 characters')
      .max(17, 'Password must be at most 17 characters'),
});

export function Login() {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate(); 
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
  
    console.log('Données envoyées:', values); // Log les données envoyées
  
    try {
      const response = await axios.post('http://localhost:5000/api/v1/login', values, {
        withCredentials: true
      });
      console.log(response.status);
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    console.log(methods.getValues()); // Log form values on render
  }, [methods]);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.formHeader}>
          <h1>Register Now</h1>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formItem}>
              <label htmlFor="email" style={styles.label}>YOUR EMAIL *</label>
              <Controller
                name="email"
                control={methods.control}
                render={({ field }) => (
                  <input id="email" placeholder="Enter your email" {...field} style={styles.input} />
                )}
              />
              {methods.formState.errors.email && (
                <p style={styles.errorMessage}>{methods.formState.errors.email.message}</p>
              )}
            </div>
            <div style={styles.formItem}>
              <label htmlFor="password" style={styles.label}>YOUR PASSWORD *</label>
              <Controller
                name="password"
                control={methods.control}
                render={({ field }) => (
                  <input id="password" type="password" placeholder="Enter your password" {...field} style={styles.input} />
                )}
              />
              {methods.formState.errors.password && (
                <p style={styles.errorMessage}>{methods.formState.errors.password.message}</p>
              )}
            </div>
            {error && <p style={styles.errorMessage}>{error}</p>}
            <div style={styles.formButton}>
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? <div style={styles.loader}></div> : 'REGISTER'}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

// Styles for the Login component
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  },
  formContainer: {
    width: '350px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontSize: '14px',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
  },
  errorMessage: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#e74c3c',
  },
  formButton: {
    marginTop: '20px',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#ff66cc', // Bright pink color from your image
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#ff1493', // Slightly darker pink on hover
  },
  loader: {
    border: '3px solid #f8bbd0', // Light pink
    borderTop: '3px solid #ad1457', // Dark pink
    borderRadius: '50%',
    width: '15px',
    height: '15px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default Login;
