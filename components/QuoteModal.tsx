'use client';

import React, { useReducer, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, Loader2, CheckCircle, Home, Search } from 'lucide-react';
import {
  initialFormState,
  formReducer,
  SERVICE_TYPE_OPTIONS,
  BUNDLE_OPTIONS,
  SERVICE_OPTIONS,
  PARTNER_SERVICES,
  PLUMBING_OPTIONS,
  ELECTRICAL_OPTIONS,
  SQFT_OPTIONS,
  STORY_OPTIONS,
  LOT_OPTIONS,
  type PropertyLookupData,
} from './quoteFormData';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StepId =
  | 'welcome'
  | 'serviceType'
  | 'wantBundle'
  | 'bundleChoice'
  | 'services'
  | 'handyman'
  | 'plumbing'
  | 'electrical'
  | 'propertyLookup'
  | 'timePicker'
  | 'contact'
  | 'thanks';

const SCHEDULING_API = process.env.NEXT_PUBLIC_SCHEDULING_API_URL || 'https://handld-scheduling-git-main-handldhome.vercel.app';

interface AvailabilitySlot {
  available: boolean;
  spotsLeft: number;
}

interface AvailabilityDay {
  date: string;
  dayName: string;
  monthDay: string;
  slots: Record<string, AvailabilitySlot>;
}

interface AvailabilityMeta {
  percentBooked: number;
}

function SingleSelect({
  options,
  value,
  onChange,
  descriptions,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  descriptions?: Record<string, string>;
}) {
  return (
    <div className="grid gap-3">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            value === opt
              ? 'border-[#2A54A1] bg-[#2A54A1]/10'
              : 'border-[#2A54A1]/15 bg-white hover:border-[#2A54A1]/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                value === opt ? 'border-[#2A54A1] bg-[#2A54A1]' : 'border-[#2A54A1]/30'
              }`}
            >
              {value === opt && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div>
              <span className="font-body font-medium text-[#2A54A1]">{opt}</span>
              {descriptions?.[opt] && (
                <p className="font-body text-sm text-[#2A54A1]/60 mt-0.5">{descriptions[opt]}</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function MultiSelect({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-[#2A54A1] bg-[#2A54A1]/10'
                : 'border-[#2A54A1]/15 bg-white hover:border-[#2A54A1]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 ${
                  isSelected ? 'border-[#2A54A1] bg-[#2A54A1]' : 'border-[#2A54A1]/30'
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-body text-sm font-medium text-[#2A54A1]">{opt}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  // Property lookup state - structured address fields
  const [lookupStreet, setLookupStreet] = useState('');
  const [lookupCity, setLookupCity] = useState('');
  const [lookupState, setLookupState] = useState('CA'); // Default to CA
  const [lookupZip, setLookupZip] = useState('');
  const [isLookingUpProperty, setIsLookingUpProperty] = useState(false);
  const [propertyLookupError, setPropertyLookupError] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Availability / time picker state
  const [availabilityWindows, setAvailabilityWindows] = useState<AvailabilityDay[]>([]);
  const [availabilityMeta, setAvailabilityMeta] = useState<AvailabilityMeta | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // Property data confirmation/editing state
  const [propertyDataConfirmed, setPropertyDataConfirmed] = useState(false);
  const [isEditingPropertyData, setIsEditingPropertyData] = useState(false);
  const [editSquareFootage, setEditSquareFootage] = useState('');
  const [editLotSize, setEditLotSize] = useState('');
  const [editStories, setEditStories] = useState('');

  // Pre-fill from URL params (e.g. from Health Check report CTA)
  const searchParams = useSearchParams();
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!isOpen || prefilled) return;

    const service = searchParams?.get('service');
    const name = searchParams?.get('name');
    const phone = searchParams?.get('phone');
    const address = searchParams?.get('address');

    if (service || name || phone || address) {
      const prefillData: Partial<typeof initialFormState> = {};

      // Pre-fill contact info
      if (name) prefillData.name = name;
      if (phone) prefillData.phone = phone;
      if (address) prefillData.address = address;

      // Pre-fill service selection
      if (service) {
        // Match service name to SERVICE_OPTIONS
        const matchedService = SERVICE_OPTIONS.find(
          s => s.toLowerCase() === service.toLowerCase()
        );
        if (matchedService) {
          prefillData.serviceType = 'Single Service';
          prefillData.wantBundle = 'No';
          prefillData.selectedServices = [matchedService];
        }
      }

      dispatch({ type: 'SET_PREFILL', data: prefillData });

      // Skip to the services step (Question 2) so user sees their service checked
      // For Single Service: steps are ['welcome', 'serviceType', 'services', ...]
      setTimeout(() => {
        setStepIndex(2); // services step index for Single Service flow
      }, 100);

      setPrefilled(true);
    }
  }, [isOpen, searchParams, prefilled]);

  // Lock body scroll and hide chat widget when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('quote-modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('quote-modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('quote-modal-open');
    };
  }, [isOpen]);

  // Cleanup auto-advance timer
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  // Compute visible steps based on selections
  const visibleSteps = useMemo<StepId[]>(() => {
    const steps: StepId[] = ['welcome', 'serviceType'];

    const isFreeHealthCheck = formState.serviceType === 'Free Home Health Check';

    if (!isFreeHealthCheck) {
      // Annual Plan shows bundle options
      if (formState.serviceType === 'Annual Plan') {
        steps.push('wantBundle');

        const wantsBundle = formState.wantBundle.startsWith('Yes');

        if (wantsBundle) {
          steps.push('bundleChoice');
        }

        // Show services unless they picked a specific named bundle
        const pickedSpecificBundle =
          wantsBundle &&
          formState.bundleChoice !== '' &&
          formState.bundleChoice !== 'Build Your Own Bundle';

        if (!pickedSpecificBundle) {
          steps.push('services');
        }
      } else {
        // Single Service goes straight to service selection
        steps.push('services');
      }

      if (formState.selectedServices.includes('Handyman')) steps.push('handyman');
      if (formState.selectedServices.includes('Plumbing Repairs')) steps.push('plumbing');
      if (formState.selectedServices.includes('Electrical Repairs')) steps.push('electrical');
    }

    steps.push('propertyLookup', 'timePicker', 'contact', 'thanks');
    return steps;
  }, [formState.serviceType, formState.wantBundle, formState.bundleChoice, formState.selectedServices]);

  const currentStep = visibleSteps[Math.min(stepIndex, visibleSteps.length - 1)];

  // Fetch availability when time picker step becomes active
  useEffect(() => {
    if (currentStep !== 'timePicker') return;
    const services = formState.selectedServices.join(',');
    setAvailabilityLoading(true);
    const url = `${SCHEDULING_API}/api/public/availability?services=${encodeURIComponent(services)}`;
    console.log('[TimePicker] Fetching availability:', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Map the API response into our AvailabilityDay shape
        const days: AvailabilityDay[] = (data.windows || []).map((w: Record<string, unknown>) => {
          const dateStr = w.date as string;
          const d = new Date(dateStr + 'T12:00:00');
          return {
            date: dateStr,
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            monthDay: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            slots: w.slots as Record<string, AvailabilitySlot>,
          };
        });
        setAvailabilityWindows(days);
        setAvailabilityMeta(data.meta || null);
      })
      .catch(() => {
        setAvailabilityWindows([]);
        setAvailabilityMeta(null);
      })
      .finally(() => setAvailabilityLoading(false));
  }, [currentStep, formState.selectedServices]);

  // Count question steps (exclude welcome and thanks)
  const questionSteps = visibleSteps.filter((s): s is StepId => s !== 'welcome' && s !== 'thanks');
  const currentQuestionIndex = questionSteps.indexOf(currentStep as typeof questionSteps[number]);
  const progressPercent =
    currentStep === 'welcome' || currentStep === 'thanks'
      ? 0
      : ((currentQuestionIndex + 1) / questionSteps.length) * 100;

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'serviceType':
        return formState.serviceType !== '';
      case 'wantBundle':
        return formState.wantBundle !== '';
      case 'bundleChoice':
        return formState.bundleChoice !== '';
      case 'services':
        return formState.selectedServices.length > 0;
      case 'handyman':
        return formState.handymanProjects.trim().length > 0;
      case 'plumbing':
        return formState.plumbingIssues.length > 0;
      case 'electrical':
        return formState.electricalIssues.length > 0;
      case 'propertyLookup':
        // Valid if we have all three property values AND user has confirmed (or manual entry)
        const hasPropertyData = formState.squareFootage !== '' &&
          formState.stories !== '' &&
          formState.lotSize !== '';
        const isFromLookup = formState.propertyDataSource === 'RentCast' || formState.propertyDataSource === 'RentCast (Corrected)';
        // If from lookup, must be confirmed. If manual entry, just need the data.
        return hasPropertyData && (propertyDataConfirmed || !isFromLookup);
      case 'timePicker':
        return true; // Always allow proceeding — user can skip or select
      case 'contact':
        // If property lookup was successful, we already have the address - don't require it again
        const addressRequired = !formState.propertyDataSource?.startsWith('RentCast');
        return (
          formState.name.trim() !== '' &&
          formState.email.trim() !== '' &&
          formState.phone.trim() !== '' &&
          (!addressRequired || formState.address.trim() !== '')
        );
      default:
        return true;
    }
  }, [currentStep, formState, propertyDataConfirmed]);

  const handleClose = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    if (currentStep === 'thanks') {
      dispatch({ type: 'RESET' });
      setStepIndex(0);
      setSubmitError('');
    }
    onClose();
  }, [currentStep, onClose]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const advanceStep = useCallback(() => {
    setDirection(1);
    setStepIndex((prev) => Math.min(prev + 1, visibleSteps.length - 1));
  }, [visibleSteps.length]);

  const handleNext = async () => {
    // Clear conditional data if parent deselected
    if (!formState.selectedServices.includes('Plumbing Repairs') && formState.plumbingIssues.length > 0) {
      dispatch({ type: 'CLEAR_ARRAY', field: 'plumbingIssues' });
    }
    if (!formState.selectedServices.includes('Electrical Repairs') && formState.electricalIssues.length > 0) {
      dispatch({ type: 'CLEAR_ARRAY', field: 'electricalIssues' });
    }

    // If on contact step, submit
    if (currentStep === 'contact') {
      setIsSubmitting(true);
      setSubmitError('');
      try {
        const res = await fetch('/api/submit-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(data.error || `Submit failed (${res.status})`);
        }
        setDirection(1);
        setStepIndex((prev) => prev + 1);
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';
        setSubmitError(msg || 'Something went wrong. Please try again or call us at (626) 298-7128.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    advanceStep();
  };

  // Auto-advance for single-select questions
  const handleSingleSelect = useCallback(
    (field: string, value: string) => {
      dispatch({ type: 'SET_FIELD', field: field as keyof typeof initialFormState, value });
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = setTimeout(() => {
        advanceStep();
      }, 350);
    },
    [advanceStep]
  );

  // Auto-advance for bundle choice (same pattern)
  const handleBundleSelect = useCallback(
    (value: string) => {
      dispatch({ type: 'SET_FIELD', field: 'bundleChoice', value });
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = setTimeout(() => {
        advanceStep();
      }, 350);
    },
    [advanceStep]
  );

  const handleBack = () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setDirection(-1);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  // Property lookup handler
  const handlePropertyLookup = async () => {
    if (!lookupStreet.trim()) {
      setPropertyLookupError('Please enter your street address');
      return;
    }
    if (!lookupCity.trim()) {
      setPropertyLookupError('Please enter your city');
      return;
    }
    if (!lookupZip.trim()) {
      setPropertyLookupError('Please enter your zip code');
      return;
    }

    // Build full address string for API
    const fullAddress = `${lookupStreet.trim()}, ${lookupCity.trim()}, ${lookupState.trim()} ${lookupZip.trim()}`;

    setIsLookingUpProperty(true);
    setPropertyLookupError('');

    try {
      const response = await fetch('/api/property-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: fullAddress }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        dispatch({
          type: 'SET_PROPERTY_DATA',
          data: data.data as PropertyLookupData,
        });
        setShowManualEntry(false);
      } else {
        setPropertyLookupError(data.error || 'Property not found. Please enter your home details manually.');
        setShowManualEntry(true);
      }
    } catch {
      setPropertyLookupError('Something went wrong. Please enter your home details manually.');
      setShowManualEntry(true);
    } finally {
      setIsLookingUpProperty(false);
    }
  };

  const handleClearPropertyLookup = () => {
    dispatch({ type: 'CLEAR_PROPERTY_LOOKUP' });
    setLookupStreet('');
    setLookupCity('');
    setLookupState('CA');
    setLookupZip('');
    setPropertyLookupError('');
    setShowManualEntry(false);
    setPropertyDataConfirmed(false);
    setIsEditingPropertyData(false);
    setEditSquareFootage('');
    setEditLotSize('');
    setEditStories('');
  };

  const handleManualEntryClick = () => {
    setShowManualEntry(true);
    dispatch({ type: 'SET_FIELD', field: 'propertyDataSource', value: 'Manual Entry' });
  };

  const handleConfirmPropertyData = () => {
    setPropertyDataConfirmed(true);
  };

  const handleEditPropertyData = () => {
    setIsEditingPropertyData(true);
    setEditSquareFootage(formState.exactSquareFootage?.toString() || '');
    setEditLotSize(formState.exactLotSize?.toString() || '');
    setEditStories(formState.exactStories?.toString() || '');
  };

  const handleSaveEditedPropertyData = () => {
    const sqft = parseInt(editSquareFootage, 10);
    const lot = parseInt(editLotSize, 10);
    const stories = parseInt(editStories, 10);

    if (sqft > 0 && lot > 0 && stories > 0) {
      dispatch({
        type: 'SET_PROPERTY_DATA',
        data: {
          squareFootage: sqft,
          lotSize: lot,
          stories: stories,
          formattedAddress: formState.propertyAddress,
          city: formState.city,
          state: formState.state,
          zipCode: formState.zipCode,
        },
      });
      // Mark as corrected by customer
      dispatch({ type: 'SET_FIELD', field: 'propertyDataSource', value: 'RentCast (Corrected)' });
      setIsEditingPropertyData(false);
      setPropertyDataConfirmed(true);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center py-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2A54A1] mb-4">
              Let&apos;s get your home Handld!
            </h2>
            <p className="font-body text-[#2A54A1]/70 mb-8 max-w-md mx-auto">
              By proceeding, you consent to receive text notifications about your quote. Message and data rates may apply.
            </p>
            <button
              onClick={handleNext}
              className="cta-button text-white px-10 py-3.5 rounded-full font-body font-bold text-lg"
            >
              Start
            </button>
          </div>
        );

      case 'serviceType':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-6">
              How can we best serve you today?
            </h2>
            <SingleSelect
              options={SERVICE_TYPE_OPTIONS}
              value={formState.serviceType}
              onChange={(v) => handleSingleSelect('serviceType', v)}
            />
          </div>
        );

      case 'wantBundle':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-6">
              Want to make home maintenance easier?
            </h2>
            <SingleSelect
              options={['Yes — make it easy with a bundle', 'No']}
              value={formState.wantBundle}
              onChange={(v) => handleSingleSelect('wantBundle', v)}
              descriptions={{
                'Yes — make it easy with a bundle': 'Recommended',
              }}
            />
          </div>
        );

      case 'bundleChoice':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-6">
              Which bundle sounds right for your home?
            </h2>
            <div className="grid gap-3">
              {BUNDLE_OPTIONS.map((bundle) => (
                <button
                  key={bundle.name}
                  type="button"
                  onClick={() => handleBundleSelect(bundle.name)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    formState.bundleChoice === bundle.name
                      ? 'border-[#2A54A1] bg-[#2A54A1]/10'
                      : 'border-[#2A54A1]/15 bg-white hover:border-[#2A54A1]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        formState.bundleChoice === bundle.name
                          ? 'border-[#2A54A1] bg-[#2A54A1]'
                          : 'border-[#2A54A1]/30'
                      }`}
                    >
                      {formState.bundleChoice === bundle.name && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <span className="font-body font-medium text-[#2A54A1]">{bundle.name}</span>
                      {bundle.savings && (
                        <p className="font-body text-sm text-[#2A54A1]/60 mt-0.5">{bundle.savings}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'services':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-2">
              Which services are you interested in?
            </h2>
            <p className="font-body text-sm text-[#2A54A1]/60 mb-6">Select ALL you&apos;d like pricing for</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((opt) => {
                const isSelected = formState.selectedServices.includes(opt);
                const isPartner = PARTNER_SERVICES.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => dispatch({ type: 'TOGGLE_MULTI', field: 'selectedServices', value: opt })}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-[#2A54A1] bg-[#2A54A1]/10'
                        : 'border-[#2A54A1]/15 bg-white hover:border-[#2A54A1]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 ${
                          isSelected ? 'border-[#2A54A1] bg-[#2A54A1]' : 'border-[#2A54A1]/30'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-body text-sm font-medium text-[#2A54A1]">
                        {opt}{isPartner ? '*' : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="font-body text-xs text-[#2A54A1]/50 mt-4">*These services are handled by trusted partners</p>
          </div>
        );

      case 'handyman':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-2">
              What handyman projects do you need help with?
            </h2>
            <p className="font-body text-sm text-[#2A54A1]/60 mb-6">
              Describe each project you&apos;d like us to handle — the more detail, the better!
            </p>
            <textarea
              value={formState.handymanProjects}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'handymanProjects', value: e.target.value })}
              placeholder="Example: Mount 55&quot; TV on living room wall, patch two small holes in bedroom drywall, fix squeaky door hinge in bathroom..."
              className="w-full h-40 p-4 rounded-xl border-2 border-[#2A54A1]/20 focus:border-[#2A54A1] focus:outline-none font-body text-[#2A54A1] placeholder:text-[#2A54A1]/40 resize-none"
            />
          </div>
        );

      case 'plumbing':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-2">
              What plumbing issue(s) can we help with?
            </h2>
            <p className="font-body text-sm text-[#2A54A1]/60 mb-6">Select all that apply</p>
            <MultiSelect
              options={PLUMBING_OPTIONS}
              selected={formState.plumbingIssues}
              onToggle={(v) => dispatch({ type: 'TOGGLE_MULTI', field: 'plumbingIssues', value: v })}
            />
          </div>
        );

      case 'electrical':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-2">
              What electrical issue(s) can we help with?
            </h2>
            <p className="font-body text-sm text-[#2A54A1]/60 mb-6">Select all that apply</p>
            <MultiSelect
              options={ELECTRICAL_OPTIONS}
              selected={formState.electricalIssues}
              onToggle={(v) => dispatch({ type: 'TOGGLE_MULTI', field: 'electricalIssues', value: v })}
            />
          </div>
        );

      case 'propertyLookup':
        // If we already have property data from lookup, show confirmation/edit flow
        if (formState.propertyDataSource?.startsWith('RentCast') && formState.squareFootage) {
          // Editing mode - show editable inputs
          if (isEditingPropertyData) {
            return (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-2">
                  Update your home details
                </h2>
                <p className="font-body text-sm text-[#2A54A1]/60 mb-6">
                  Enter the correct values for your home
                </p>
                <div className="bg-[#2A54A1]/5 border-2 border-[#2A54A1]/20 rounded-xl p-6 mb-6">
                  <p className="font-body font-medium text-[#2A54A1] mb-4">
                    {formState.propertyAddress}
                  </p>
                  <div className="grid gap-4">
                    <div>
                      <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">
                        Square Footage
                      </label>
                      <input
                        type="number"
                        value={editSquareFootage}
                        onChange={(e) => setEditSquareFootage(e.target.value)}
                        placeholder="e.g., 2500"
                        className="w-full p-3 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">
                        Lot Size (sq ft)
                      </label>
                      <input
                        type="number"
                        value={editLotSize}
                        onChange={(e) => setEditLotSize(e.target.value)}
                        placeholder="e.g., 7500"
                        className="w-full p-3 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">
                        Stories
                      </label>
                      <input
                        type="number"
                        value={editStories}
                        onChange={(e) => setEditStories(e.target.value)}
                        placeholder="e.g., 2"
                        min="1"
                        max="4"
                        className="w-full p-3 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingPropertyData(false)}
                    className="flex-1 py-3 rounded-xl border-2 border-[#2A54A1]/20 font-body font-medium text-[#2A54A1] hover:bg-[#2A54A1]/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditedPropertyData}
                    disabled={!editSquareFootage || !editLotSize || !editStories}
                    className="flex-1 py-3 rounded-xl bg-[#2A54A1] text-white font-body font-medium hover:bg-[#2A54A1]/90 transition-colors disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            );
          }

          // Confirmed - show success state
          if (propertyDataConfirmed) {
            return (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-6">
                  Perfect, we&apos;ve got your home details!
                </h2>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-body font-medium text-[#2A54A1] mb-3">
                        {formState.propertyAddress}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-body text-[#2A54A1]/60">Square Feet</p>
                          <p className="font-body font-semibold text-[#2A54A1]">
                            {formState.exactSquareFootage?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-body text-[#2A54A1]/60">Lot Size</p>
                          <p className="font-body font-semibold text-[#2A54A1]">
                            {formState.exactLotSize?.toLocaleString()} sq ft
                          </p>
                        </div>
                        <div>
                          <p className="font-body text-[#2A54A1]/60">Stories</p>
                          <p className="font-body font-semibold text-[#2A54A1]">
                            {formState.exactStories}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearPropertyLookup}
                  className="font-body text-sm text-[#2A54A1]/60 hover:text-[#2A54A1] transition-colors underline"
                >
                  Look up a different address
                </button>
              </div>
            );
          }

          // Not confirmed yet - show data with confirmation buttons
          return (
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-2">
                We found your home!
              </h2>
              <p className="font-body text-sm text-[#2A54A1]/60 mb-6">
                Please confirm these details are correct
              </p>
              <div className="bg-[#2A54A1]/5 border-2 border-[#2A54A1]/20 rounded-xl p-6 mb-6">
                <p className="font-body font-medium text-[#2A54A1] mb-4">
                  {formState.propertyAddress}
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-body text-[#2A54A1]/60">Square Feet</p>
                    <p className="font-body font-semibold text-[#2A54A1] text-lg">
                      {formState.exactSquareFootage?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-[#2A54A1]/60">Lot Size</p>
                    <p className="font-body font-semibold text-[#2A54A1] text-lg">
                      {formState.exactLotSize?.toLocaleString()} sq ft
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-[#2A54A1]/60">Stories</p>
                    <p className="font-body font-semibold text-[#2A54A1] text-lg">
                      {formState.exactStories}
                    </p>
                  </div>
                </div>
              </div>
              <p className="font-body font-medium text-[#2A54A1] mb-4 text-center">
                Does this look correct?
              </p>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={handleEditPropertyData}
                  className="flex-1 py-3 rounded-xl border-2 border-[#2A54A1]/20 font-body font-medium text-[#2A54A1] hover:bg-[#2A54A1]/5 transition-colors"
                >
                  No, let me edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPropertyData}
                  className="flex-1 py-3 rounded-xl bg-[#2A54A1] text-white font-body font-medium hover:bg-[#2A54A1]/90 transition-colors"
                >
                  Yes, this is correct
                </button>
              </div>
              <button
                type="button"
                onClick={handleClearPropertyLookup}
                className="font-body text-sm text-[#2A54A1]/60 hover:text-[#2A54A1] transition-colors underline w-full text-center"
              >
                Look up a different address
              </button>
            </div>
          );
        }

        // Show the lookup form or manual entry
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-2">
              Tell us about your home
            </h2>
            <p className="font-body text-sm text-[#2A54A1]/60 mb-6">
              Enter your address and we&apos;ll look up your home details automatically
            </p>

            {/* Address lookup section */}
            {!showManualEntry && (
              <div className="mb-6">
                <div className="grid gap-4">
                  {/* Street Address */}
                  <div className="relative">
                    <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2A54A1]/40" />
                    <input
                      type="text"
                      value={lookupStreet}
                      onChange={(e) => setLookupStreet(e.target.value)}
                      placeholder="Street Address (e.g., 123 Main St)"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                      disabled={isLookingUpProperty}
                    />
                  </div>

                  {/* City, State, Zip row */}
                  <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={lookupCity}
                        onChange={(e) => setLookupCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                        disabled={isLookingUpProperty}
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="text"
                        value={lookupState}
                        onChange={(e) => setLookupState(e.target.value.toUpperCase().slice(0, 2))}
                        placeholder="State"
                        maxLength={2}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors text-center"
                        disabled={isLookingUpProperty}
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={lookupZip}
                        onChange={(e) => setLookupZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handlePropertyLookup();
                          }
                        }}
                        placeholder="Zip Code"
                        maxLength={5}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                        disabled={isLookingUpProperty}
                      />
                    </div>
                  </div>

                  {/* Look Up Button */}
                  <button
                    type="button"
                    onClick={handlePropertyLookup}
                    disabled={isLookingUpProperty || !lookupStreet.trim() || !lookupCity.trim() || !lookupZip.trim()}
                    className="w-full py-3.5 rounded-xl bg-[#2A54A1] text-white font-body font-medium flex items-center justify-center gap-2 hover:bg-[#2A54A1]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLookingUpProperty ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Looking up your home...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Look Up My Home
                      </>
                    )}
                  </button>
                </div>

                {propertyLookupError && (
                  <p className="font-body text-sm text-amber-600 mt-3">{propertyLookupError}</p>
                )}

                <button
                  type="button"
                  onClick={handleManualEntryClick}
                  className="font-body text-sm text-[#2A54A1]/60 hover:text-[#2A54A1] transition-colors underline mt-4"
                >
                  Enter details manually instead
                </button>
              </div>
            )}

            {/* Manual entry fallback */}
            {showManualEntry && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-body font-medium text-[#2A54A1] mb-3">Square Footage</h3>
                  <SingleSelect
                    options={SQFT_OPTIONS}
                    value={formState.squareFootage}
                    onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'squareFootage', value: v })}
                  />
                </div>

                <div>
                  <h3 className="font-body font-medium text-[#2A54A1] mb-3">
                    Stories <span className="text-[#2A54A1]/60 font-normal">(not including basement)</span>
                  </h3>
                  <SingleSelect
                    options={STORY_OPTIONS}
                    value={formState.stories}
                    onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'stories', value: v })}
                  />
                </div>

                <div>
                  <h3 className="font-body font-medium text-[#2A54A1] mb-3">Lot Size</h3>
                  <SingleSelect
                    options={LOT_OPTIONS}
                    value={formState.lotSize}
                    onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'lotSize', value: v })}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowManualEntry(false);
                    setPropertyLookupError('');
                  }}
                  className="font-body text-sm text-[#2A54A1]/60 hover:text-[#2A54A1] transition-colors underline"
                >
                  Try address lookup instead
                </button>
              </div>
            )}
          </div>
        );

      case 'timePicker':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-2">
              When works best for you?
            </h2>
            <p className="font-body text-sm text-[#2A54A1]/60 mb-6">
              Pick a morning or afternoon window. We&apos;ll confirm your exact arrival time.
            </p>

            {availabilityLoading ? (
              <div className="text-center py-12 text-[#2A54A1]/40 font-body">Loading available times...</div>
            ) : availabilityWindows.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-body text-sm text-[#2A54A1]/60 mb-4">
                  We&apos;re currently finalizing our schedule. We&apos;ll reach out to find a time that works for you.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'SET_FIELD', field: 'preferredDate', value: '' });
                    dispatch({ type: 'SET_FIELD', field: 'preferredTime', value: '' });
                    advanceStep();
                  }}
                  className="font-body text-sm font-semibold text-[#2A54A1] hover:text-[#2A54A1]/80 underline underline-offset-2"
                >
                  Continue without selecting a time
                </button>
              </div>
            ) : (
              <>
                {availabilityMeta && availabilityMeta.percentBooked > 50 && (
                  <div className="bg-[#FFF7E6] border border-[#F59E0B]/30 rounded-xl px-4 py-2.5 text-sm text-[#92400E] font-body font-medium mb-4">
                    {availabilityMeta.percentBooked}% of this week&apos;s windows are already booked
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {availabilityWindows.map(day => (
                    <div key={day.date} className="rounded-xl border-2 border-[#2A54A1]/10 p-3 bg-white">
                      <div className="font-body text-xs font-semibold text-[#2A54A1]/50 uppercase">{day.dayName}</div>
                      <div className="font-body text-sm font-bold text-[#2A54A1] mb-2">{day.monthDay}</div>
                      <div className="flex flex-col gap-2">
                        {(['AM', 'PM'] as const).map(period => {
                          const slot = day.slots[period];
                          if (!slot) return null;
                          const isSelected = formState.preferredDate === day.date && formState.preferredTime === period;
                          return (
                            <button
                              key={period}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => {
                                dispatch({ type: 'SET_FIELD', field: 'preferredDate', value: day.date });
                                dispatch({ type: 'SET_FIELD', field: 'preferredTime', value: period });
                              }}
                              className={`
                                w-full px-3 py-2.5 rounded-xl text-sm font-semibold font-body transition-all
                                ${isSelected
                                  ? 'border-2 border-[#2A54A1] bg-[#2A54A1]/10 text-[#2A54A1]'
                                  : slot.available
                                    ? 'border-2 border-[#2A54A1]/15 bg-white text-[#2A54A1]/70 hover:border-[#2A54A1]/40'
                                    : 'border-2 border-[#2A54A1]/5 bg-[#2A54A1]/[0.03] text-[#2A54A1]/20 cursor-not-allowed'}
                              `}
                            >
                              <span className="flex items-center justify-center gap-1.5">
                                {isSelected && (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {period === 'AM' ? 'Morning' : 'Afternoon'}
                              </span>
                              {slot.available && slot.spotsLeft <= 2 && (
                                <span className="block text-xs font-normal mt-0.5 text-[#F59E0B]">
                                  {slot.spotsLeft === 1 ? 'Last spot!' : `${slot.spotsLeft} left`}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'SET_FIELD', field: 'preferredDate', value: '' });
                    dispatch({ type: 'SET_FIELD', field: 'preferredTime', value: '' });
                    advanceStep();
                  }}
                  className="w-full text-center font-body text-sm text-[#2A54A1]/40 hover:text-[#2A54A1]/60 py-2"
                >
                  Skip — I&apos;m flexible on timing
                </button>
              </>
            )}
          </div>
        );

      case 'contact':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-6">
              Almost done! Where should we send your quote?
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
                  className="w-full p-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">Email *</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                  className="w-full p-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">Phone Number *</label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'phone', value: e.target.value })}
                  className="w-full p-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
              {/* Only show address fields if property lookup wasn't successful */}
              {!formState.propertyDataSource?.startsWith('RentCast') && (
                <>
                  <div>
                    <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">Service Address *</label>
                    <input
                      type="text"
                      value={formState.address}
                      onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'address', value: e.target.value })}
                      className="w-full p-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">City</label>
                      <input
                        type="text"
                        value={formState.city}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'city', value: e.target.value })}
                        className="w-full p-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                        placeholder="Pasadena"
                      />
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">State</label>
                      <input
                        type="text"
                        value={formState.state}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'state', value: e.target.value })}
                        className="w-full p-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                        placeholder="CA"
                      />
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">Zip Code</label>
                      <input
                        type="text"
                        value={formState.zipCode}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'zipCode', value: e.target.value })}
                        className="w-full p-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                        placeholder="91101"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-[#2A54A1] mb-1.5 block">Apt/Unit</label>
                    <input
                      type="text"
                      value={formState.addressLine2}
                      onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'addressLine2', value: e.target.value })}
                      className="w-full p-3.5 rounded-xl border-2 border-[#2A54A1]/15 bg-white font-body text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                      placeholder="Optional"
                    />
                  </div>
                </>
              )}
            </div>
            {submitError && (
              <p className="font-body text-sm text-red-600 mt-4">{submitError}</p>
            )}
          </div>
        );

      case 'thanks':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#2A54A1] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2A54A1] mb-4">
              Thank you for trusting us with your home!
            </h2>
            <p className="font-body text-[#2A54A1]/70 mb-8 max-w-md mx-auto">
              {formState.serviceType === 'Free Home Health Check'
                ? "We'll notify you via text once your Home Health Check has been scheduled."
                : 'Your custom quote is on the way! Check your text for a link in the next 2 minutes.'}
            </p>
            <button
              onClick={handleClose}
              className="cta-button text-white px-10 py-3.5 rounded-full font-body font-bold text-lg"
            >
              Done
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const isQuestionStep = currentStep !== 'welcome' && currentStep !== 'thanks';
  const isContactStep = currentStep === 'contact';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25 }}
        className="bg-[#FFFFF2] w-full max-h-[95vh] md:max-w-2xl md:max-h-[90vh] md:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A54A1]/10 flex-shrink-0">
          <div className="font-body text-sm font-medium text-[#2A54A1]/60">
            {isQuestionStep
              ? `Question ${currentQuestionIndex + 1} of ${questionSteps.length}`
              : ''}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2A54A1]/10 transition-colors"
          >
            <X className="w-5 h-5 text-[#2A54A1]" />
          </button>
        </div>

        {/* Progress bar */}
        {isQuestionStep && (
          <div className="h-1 bg-[#2A54A1]/10 flex-shrink-0">
            <div
              className="h-full bg-[#2A54A1] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation footer */}
        {isQuestionStep && (
          <div className="px-6 py-4 border-t border-[#2A54A1]/10 bg-[#FBF9F0] flex justify-between items-center flex-shrink-0">
            {stepIndex > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 font-body font-medium text-[#2A54A1] hover:text-[#2A54A1]/70 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="cta-button text-white px-8 py-2.5 rounded-full font-body font-bold"
            >
              {isContactStep ? (isSubmitting ? 'Submitting...' : 'Submit') : 'Next'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
