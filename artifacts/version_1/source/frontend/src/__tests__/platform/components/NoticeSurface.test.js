/**
 * NoticeSurface Component Tests
 * File: NoticeSurface.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import NoticeSurfaceWeb from '@platform/components/feedback/NoticeSurface/NoticeSurface.web';
import NoticeSurfaceAndroid from '@platform/components/feedback/NoticeSurface/NoticeSurface.android';
import NoticeSurfaceIOS from '@platform/components/feedback/NoticeSurface/NoticeSurface.ios';

const mockToast = jest.fn(() => null);

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('@platform/components/feedback/Toast', () => ({
  __esModule: true,
  default: (props) => mockToast(props),
}));

describe('NoticeSurface Component', () => {
  beforeEach(() => {
    mockToast.mockClear();
  });

  it('returns null when no notices are provided', () => {
    const { toJSON } = render(<NoticeSurfaceWeb />);
    expect(toJSON()).toBeNull();
  });

  it('renders toast on web when visible', () => {
    render(<NoticeSurfaceWeb toast={{ visible: true, message: 'Hi', testID: 'toast' }} />);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ message: 'Hi' }));
  });

  it('renders toast on Android when visible', () => {
    render(<NoticeSurfaceAndroid toast={{ visible: true, message: 'Syncing', testID: 'toast' }} />);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ message: 'Syncing' }));
  });

  it('renders toast on iOS when visible', () => {
    render(<NoticeSurfaceIOS toast={{ visible: true, message: 'Ready', testID: 'toast' }} />);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ message: 'Ready' }));
  });
});
