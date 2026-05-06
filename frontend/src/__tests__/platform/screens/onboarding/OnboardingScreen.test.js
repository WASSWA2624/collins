const React = require('react');
const { fireEvent, render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');

const useOnboarding = require('@hooks/useOnboarding').default;

jest.mock('@hooks/useOnboarding', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => {
      const values = {
        'settings.onboarding.title': 'Getting started',
        'settings.onboarding.accessibilityLabel': 'Onboarding screen',
        'settings.onboarding.steps.clinicalSafety.title': 'Use as advisory support',
        'settings.onboarding.steps.clinicalSafety.body': 'Review the safety note before using AI Vent.',
        'settings.onboarding.safety.title': 'Clinical safety',
        'settings.onboarding.safety.body': 'Advisory safety prompts only.',
        'settings.onboarding.safety.secondary': 'Confirm all decisions locally.',
        'settings.onboarding.safety.accessibilityLabel': 'Clinical safety notice',
        'settings.onboarding.safety.acknowledgeLabel': 'I understand this is advisory decision support only',
        'settings.onboarding.safety.acknowledgeHint': 'Required before continuing',
        'settings.onboarding.safety.syncDeferred': 'Sync deferred',
        'settings.onboarding.actions.back': 'Back',
        'settings.onboarding.actions.next': 'Next',
        'settings.onboarding.actions.done': 'Done',
      };
      return values[key] || key;
    },
  }),
}));

const OnboardingScreenAndroid = require('@platform/screens/onboarding/OnboardingScreen/OnboardingScreen.android').default;
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const baseOnboarding = {
  steps: [{ id: 'clinicalSafety', order: 0 }],
  currentStepId: 'clinicalSafety',
  nextStepId: 'facilityWorkflow',
  prevStepId: null,
  isFirst: true,
  isLast: false,
  clinicalSafetyAcknowledged: false,
  isPersistingSafety: false,
  syncErrorCode: null,
  canComplete: false,
  goNext: jest.fn(),
  goBack: jest.fn(),
  setClinicalSafetyAcknowledged: jest.fn(),
  completeOnboarding: jest.fn(),
};

const renderWithTheme = (node) => render(<ThemeProvider theme={lightTheme}>{node}</ThemeProvider>);

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboarding.mockReturnValue({ ...baseOnboarding });
  });

  it('renders in-flow clinical safety notice on Android', () => {
    const { getByTestId } = renderWithTheme(<OnboardingScreenAndroid />);

    expect(getByTestId('onboarding-screen')).toBeTruthy();
    expect(getByTestId('onboarding-safety-notice').props.title).toBe('Clinical safety');
  });

  it('requires acknowledgement before advancing from the safety step', () => {
    const goNext = jest.fn();
    useOnboarding.mockReturnValue({ ...baseOnboarding, goNext });

    const { getByTestId } = renderWithTheme(<OnboardingScreenAndroid />);
    fireEvent.press(getByTestId('onboarding-next'));

    expect(goNext).not.toHaveBeenCalled();
  });

  it('completes onboarding on the last step when acknowledged', async () => {
    const completeOnboarding = jest.fn().mockResolvedValue(true);
    useOnboarding.mockReturnValue({
      ...baseOnboarding,
      currentStepId: 'offline',
      isFirst: false,
      isLast: true,
      clinicalSafetyAcknowledged: true,
      canComplete: true,
      completeOnboarding,
    });

    const { getByTestId } = renderWithTheme(<OnboardingScreenAndroid />);
    fireEvent.press(getByTestId('onboarding-done'));

    await Promise.resolve();
    expect(completeOnboarding).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
