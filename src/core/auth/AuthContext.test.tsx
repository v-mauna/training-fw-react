import React, { useContext } from 'react';
import { render, cleanup, wait, waitForElement } from '@testing-library/react';
import { AuthContext, AuthProvider } from './AuthContext';
import { IdentityService } from '../services';
import { User } from '../models';

const MockConsumer: React.FC = () => {
  const { state } = useContext(AuthContext);

  return (
    <div>
      <div data-testid="status">{state.status}</div>
      <div data-testid="error">{state.error}</div>
      <div data-testid="user">{JSON.stringify(state.user)}</div>
    </div>
  );
};

const ComponentTree = (
  <AuthProvider>
    <MockConsumer />
  </AuthProvider>
);

const mockUser: User = {
  id: 42,
  firstName: 'Joe',
  lastName: 'Tester',
  email: 'test@test.org',
};

describe('<AuthProvider />', () => {
  let identityService: IdentityService;

  beforeEach(() => {
    identityService = IdentityService.getInstance();
    identityService.init = jest.fn(() => Promise.resolve());
  });

  it('displays the loader when initializing', async () => {
    const { container } = render(ComponentTree);
    expect(container).toHaveTextContent(/Loading.../);
    await wait(() => expect(container).not.toHaveTextContent(/Loading.../));
  });

  describe('when a token is stored', () => {
    beforeEach(() => {
      identityService['_user'] = mockUser;
      identityService['_token'] = '3884915llf950';
    });

    it('sets the status to authenticated', async () => {
      const { getByTestId } = render(ComponentTree);
      const status = await waitForElement(() => getByTestId('status'));
      expect(status.textContent).toEqual('authenticated');
    });

    it('sets the user profile', async () => {
      const { getByTestId } = render(ComponentTree);
      const user = await waitForElement(() => getByTestId('user'));
      expect(user.textContent).toEqual(JSON.stringify(mockUser));
    });
  });

  describe('when a token is not stored', () => {
    beforeEach(() => {
      identityService['_user'] = undefined;
      identityService['_token'] = undefined;
    });

    it('sets the status to unauthenticated', async () => {
      const { getByTestId } = render(ComponentTree);
      const status = await waitForElement(() => getByTestId('status'));
      expect(status.textContent).toEqual('unauthenticated');
    });

    it('does not set the user profile', async () => {
      const { getByTestId } = render(ComponentTree);
      const user = await waitForElement(() => getByTestId('user'));
      expect(user.textContent).toEqual('');
    });
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });
});
