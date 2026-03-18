"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, FileText, Clock, Calendar, User } from "lucide-react";
import { Button, FormInput, FormSelect } from "@/components/ds";

const practitioners = [
  { id: "1", name: "Hrishikesh Koli", initials: "HK", role: "Prac ti sion", color: "#7c3aed", tagline: "HEY HEY HEY" },
  { id: "2", name: "Ruvi R.", initials: "RR", role: "Occupational Therapist", color: "#f97316", tagline: "" },
  { id: "3", name: "Joseph Ge", initials: "", role: "Physiotherapist", color: "#10b981", tagline: "Joseph", hasPhoto: true },
];

const weekDays = [
  { date: 17, day: "Tue" },
  { date: 18, day: "Wed" },
  { date: 19, day: "Thu" },
  { date: 20, day: "Fri" },
  { date: 21, day: "Sat" },
];

const availableSlots = ["9:20am", "10:50am", "12:20pm", "1:50pm"];

type Step = "select" | "confirm";

export default function OnlineBookingPage() {
  const [step, setStep] = useState<Step>("select");
  const [selectedPractitioner, setSelectedPractitioner] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(19);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAllTimes, setShowAllTimes] = useState(false);
  const [firstName, setFirstName] = useState("Beep");
  const [lastName, setLastName] = useState("Boop");
  const [phoneCode, setPhoneCode] = useState("+61");
  const [phone, setPhone] = useState("0043243290");
  const [email, setEmail] = useState("beep@boop.com");
  const [dobDay, setDobDay] = useState("3");
  const [dobMonth, setDobMonth] = useState("July");
  const [dobYear, setDobYear] = useState("2020");
  const [comments, setComments] = useState("");
  const [rememberDetails, setRememberDetails] = useState(true);

  const selectedPrac = practitioners.find((p) => p.id === selectedPractitioner);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Back link */}
        <button
          onClick={() => (step === "confirm" ? setStep("select") : null)}
          className="mb-6 flex items-center gap-1 text-sm text-text-secondary hover:text-text"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1">
            {step === "select" && (
              <>
                <h1 className="mb-6 text-3xl font-bold text-text">Select an appointment</h1>

                {/* Filters */}
                <div className="mb-4 flex gap-3">
                  <div className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary">
                    <User className="mr-2 inline h-4 w-4" />
                    All practitioners
                  </div>
                  <div className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary">
                    <Calendar className="mr-2 inline h-4 w-4" />
                    Any date
                  </div>
                  <div className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary">
                    <Clock className="mr-2 inline h-4 w-4" />
                    Any time
                  </div>
                </div>

                <p className="mb-8 text-xs text-text-secondary">
                  All times are shown in (GMT+10:30) – Adelaide
                </p>

                <hr className="mb-8 border-border" />

                {/* Practitioner list */}
                <div className="space-y-8">
                  {practitioners.map((prac) => {
                    const hasSlots = prac.id === "1";
                    return (
                      <div key={prac.id} className="flex gap-6">
                        {/* Practitioner info */}
                        <div className="w-40 shrink-0">
                          <div className="mb-2 flex items-center gap-3">
                            {prac.hasPhoto ? (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-text-secondary">
                                {prac.name[0]}
                              </div>
                            ) : (
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: prac.color }}
                              >
                                {prac.initials}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-text">{prac.name}</div>
                              <div className="text-xs text-text-secondary">{prac.role}</div>
                            </div>
                          </div>
                          {prac.tagline && (
                            <div className="text-xs text-text-secondary">{prac.tagline}</div>
                          )}
                        </div>

                        {/* Date/time picker */}
                        <div className="flex-1">
                          <div className="mb-2 text-sm font-semibold text-text">March 2026</div>
                          <div className="mb-4 flex items-center gap-1">
                            <button className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-gray-100">
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            {weekDays.map((d) => (
                              <button
                                key={d.date}
                                onClick={() => {
                                  setSelectedDate(d.date);
                                  setSelectedPractitioner(prac.id);
                                }}
                                className={`flex h-10 w-10 flex-col items-center justify-center rounded-full text-xs ${
                                  selectedDate === d.date && selectedPractitioner === prac.id
                                    ? "bg-primary text-white"
                                    : "text-text hover:bg-gray-100"
                                }`}
                              >
                                <span className="text-[10px]">{d.date}</span>
                              </button>
                            ))}
                            <button className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-gray-100">
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mb-1 flex text-[10px] text-text-secondary">
                            {weekDays.map((d) => (
                              <span key={d.date} className="w-10 text-center">
                                {d.day}
                              </span>
                            ))}
                          </div>

                          {hasSlots ? (
                            <div className="space-y-2">
                              {(showAllTimes ? availableSlots : availableSlots.slice(0, 4)).map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => {
                                    setSelectedTime(slot);
                                    setSelectedPractitioner(prac.id);
                                    setStep("confirm");
                                  }}
                                  className="block w-28 rounded-lg border border-border px-3 py-2 text-sm text-text hover:border-primary hover:bg-purple-50"
                                >
                                  {slot}
                                </button>
                              ))}
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setShowAllTimes(!showAllTimes)}
                                className="mt-2"
                              >
                                {showAllTimes ? "Show fewer" : "See all times"}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-text-secondary">
                                No available times for your search. Please try a different date or join the waitlist to be
                                notified if a spot opens.
                              </p>
                              <Button variant="primary" size="sm">
                                Next available
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {step === "confirm" && (
              <>
                <h1 className="mb-6 text-3xl font-bold text-text">Confirm your appointment</h1>

                <div className="max-w-lg space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="First name *"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <FormInput
                      label="Last name *"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-text-secondary">Phone number *</label>
                      <div className="flex gap-2">
                        <select
                          value={phoneCode}
                          onChange={(e) => setPhoneCode(e.target.value)}
                          className="w-20 rounded-lg border border-border bg-white px-2 py-2 text-sm outline-none focus:border-primary"
                        >
                          <option value="+61">+61</option>
                          <option value="+64">+64</option>
                          <option value="+1">+1</option>
                        </select>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <FormInput
                      label="Email address *"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-secondary">Date of birth *</label>
                    <div className="grid grid-cols-3 gap-2">
                      <FormSelect
                        options={Array.from({ length: 31 }, (_, i) => ({
                          value: String(i + 1),
                          label: String(i + 1),
                        }))}
                        value={dobDay}
                        onChange={(e) => setDobDay(e.target.value)}
                      />
                      <FormSelect
                        options={[
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December",
                        ].map((m) => ({ value: m, label: m }))}
                        value={dobMonth}
                        onChange={(e) => setDobMonth(e.target.value)}
                      />
                      <FormSelect
                        options={Array.from({ length: 100 }, (_, i) => ({
                          value: String(2026 - i),
                          label: String(2026 - i),
                        }))}
                        value={dobYear}
                        onChange={(e) => setDobYear(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-secondary">
                      Comments (optional)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      maxLength={500}
                      rows={4}
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                    <div className="mt-1 text-right text-xs text-text-secondary">
                      {comments.length} / 500
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberDetails}
                      onChange={(e) => setRememberDetails(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                    <span className="text-sm text-text">Remember my details for next time</span>
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Sidebar — Appointment summary */}
          <div className="w-72 shrink-0">
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-text">Appointment summary</h2>

              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-text">Location</div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <MapPin className="h-3 w-3" /> Tasks
                    </div>
                  </div>
                  <button className="text-text-secondary hover:text-text">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z" />
                    </svg>
                  </button>
                </div>

                {/* Service */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-text">Service</div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <FileText className="h-3 w-3" /> 1:1 Consultation (40 mins d...
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <span className="h-3 w-3 text-center">$</span> A$148.71
                    </div>
                  </div>
                </div>

                {/* Appointment */}
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${step === "confirm" ? "bg-primary" : "bg-gray-300"}`} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-text">Appointment</div>
                    {step === "confirm" && selectedPrac && (
                      <>
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <User className="h-3 w-3" /> {selectedPrac.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <Clock className="h-3 w-3" /> {selectedTime}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <Calendar className="h-3 w-3" /> Thursday 19 March 2026
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Booking details */}
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${step === "confirm" ? "bg-primary" : "bg-gray-300"}`} />
                  <div className="flex-1">
                    <div className="text-sm text-text-secondary">Booking details</div>
                    {step === "confirm" && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-text">Total:</span>
                        <span className="text-sm font-semibold text-text">A$148.71</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="mt-6">
                {step === "select" ? (
                  <button
                    disabled
                    className="w-full rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-400"
                  >
                    Continue
                  </button>
                ) : (
                  <Button variant="primary" className="w-full justify-center">
                    Confirm
                  </Button>
                )}
              </div>

              {step === "select" && (
                <p className="mt-3 text-center text-xs text-text-secondary">
                  Can&apos;t find a suitable time?{" "}
                  <a href="#" className="text-primary hover:underline">
                    Join the waitlist.
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pb-8 text-center text-sm text-text-secondary">
          Powered by <span className="font-bold text-primary">splose</span>
        </div>
      </div>
    </div>
  );
}
