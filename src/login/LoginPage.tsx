import React, { useEffect } from 'react';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { useAuthentication } from '../core/auth';
import { logInOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';

const LoginPage: React.FC = () => {
  const { login, error, status } = useAuthentication();
  const history = useHistory();
  const { handleSubmit, control, formState, errors } = useForm<{
    email: string;
    password: string;
  }>({
    mode: 'onChange',
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data.email, data.password);
  };

  useEffect(() => {
    if (status === 'authenticated') {
      history.replace('/tabs');
    }
  }, [status, history]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form>
          <IonList>
            <IonItem>
              <IonLabel position="floating">E-Mail Address</IonLabel>
              <Controller
                render={({ onChange, value }) => (
                  <IonInput
                    id="email-input"
                    onIonChange={(e: any) => onChange(e.detail.value!)}
                    value={value}
                  />
                )}
                control={control}
                name="email"
                rules={{
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'E-Mail Address must have a valid format',
                  },
                }}
                defaultValue={''}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <Controller
                render={({ onChange, value }) => (
                  <IonInput
                    id="password-input"
                    onIonChange={(e: any) => onChange(e.detail.value!)}
                    value={value}
                    type="password"
                  />
                )}
                control={control}
                name="password"
                rules={{ required: true }}
                defaultValue={''}
              />
            </IonItem>
          </IonList>
          <div className="error-message">
            <div>
              {errors.email?.type === 'required' &&
                'E-Mail Address is required'}
            </div>
            <div>
              {errors.email?.type === 'pattern' && errors.email.message}
            </div>
            <div>
              {errors.password?.type === 'required' && 'Password is required'}
            </div>
            {error && <div>{error.message}</div>}
          </div>
        </form>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            expand="full"
            disabled={!formState.isValid}
            onClick={handleSubmit(data => handleLogin(data))}
          >
            Sign In
            <IonIcon slot="end" icon={logInOutline} />
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default LoginPage;
