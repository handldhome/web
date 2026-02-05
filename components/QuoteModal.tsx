'use client';

import React, { useReducer, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import {
  initialFormState,
  formReducer,
  SERVICE_TYPE_OPTIONS,
  BUNDLE_OPTIONS,
  SERVICE_OPTIONS,
  PLUMBING_OPTIONS,
  ELECTRICAL_OPTIONS,
  SQFT_OPTIONS,
  STORY_OPTIONS,
  LOT_OPTIONS,
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
  | 'plumbing'
  | 'electrical'
  | 'sqft'
  | 'stories'
  | 'lotSize'
  | 'contact'
  | 'thanks';

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

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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

    const isHomeTuneUp = formState.serviceType === 'Home TuneUp';

    if (!isHomeTuneUp) {
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

      if (formState.selectedServices.includes('Plumbing Repairs')) steps.push('plumbing');
      if (formState.selectedServices.includes('Electrical Repairs')) steps.push('electrical');
    }

    steps.push('sqft', 'stories', 'lotSize', 'contact', 'thanks');
    return steps;
  }, [formState.serviceType, formState.wantBundle, formState.bundleChoice, formState.selectedServices]);

  const currentStep = visibleSteps[Math.min(stepIndex, visibleSteps.length - 1)];

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
      case 'plumbing':
        return formState.plumbingIssues.length > 0;
      case 'electrical':
        return formState.electricalIssues.length > 0;
      case 'sqft':
        return formState.squareFootage !== '';
      case 'stories':
        return formState.stories !== '';
      case 'lotSize':
        return formState.lotSize !== '';
      case 'contact':
        return (
          formState.name.trim() !== '' &&
          formState.email.trim() !== '' &&
          formState.phone.trim() !== '' &&
          formState.address.trim() !== ''
        );
      default:
        return true;
    }
  }, [currentStep, formState]);

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
        const res = await fetch('/api/quote', {
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
              Want to make home maintenance easier...and save 30%?
            </h2>
            <SingleSelect
              options={['Yes — make it easy, bundle & save 30%', 'No']}
              value={formState.wantBundle}
              onChange={(v) => handleSingleSelect('wantBundle', v)}
              descriptions={{
                'Yes — make it easy, bundle & save 30%': 'Recommended',
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
            <MultiSelect
              options={SERVICE_OPTIONS}
              selected={formState.selectedServices}
              onToggle={(v) => dispatch({ type: 'TOGGLE_MULTI', field: 'selectedServices', value: v })}
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

      case 'sqft':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-6">
              What is your home&apos;s square footage?
            </h2>
            <SingleSelect
              options={SQFT_OPTIONS}
              value={formState.squareFootage}
              onChange={(v) => handleSingleSelect('squareFootage', v)}
            />
          </div>
        );

      case 'stories':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-2">
              How many stories is your home?
            </h2>
            <p className="font-body text-sm text-[#2A54A1]/60 mb-6">Do not include basement/subterranean</p>
            <SingleSelect
              options={STORY_OPTIONS}
              value={formState.stories}
              onChange={(v) => handleSingleSelect('stories', v)}
            />
          </div>
        );

      case 'lotSize':
        return (
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2A54A1] mb-6">
              What&apos;s your lot size?
            </h2>
            <SingleSelect
              options={LOT_OPTIONS}
              value={formState.lotSize}
              onChange={(v) => handleSingleSelect('lotSize', v)}
            />
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
              Your custom quote is on the way! Check your text for a link in the next 2 minutes.
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
