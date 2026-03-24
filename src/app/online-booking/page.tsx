"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin, FileText, Clock, Calendar, User, CheckCircle, Mail, CalendarPlus, Copy } from "lucide-react";
import { Avatar, Button, Checkbox, FormInput, FormSelect, FormTextarea, Alert } from "@/components/ds";

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

const mockLocations = [
  { id: "tasks", name: "Tasks", description: "Mobile and/or telehealth services" },
  { id: "east-clinics", name: "East Clinics", description: "Mobile and/or telehealth services" },
  { id: "splose-ot", name: "Splose OT", description: "Mobile and/or telehealth services" },
  { id: "ploc", name: "Ploc", description: "Mobile and/or telehealth services" },
  { id: "sharons", name: "Sharon's", description: "Mobile and/or telehealth services" },
  { id: "one-service", name: "One service only", description: "Mobile and/or telehealth services" },
];

type Step = "location" | "select" | "confirm" | "confirmed";

export default function OnlineBookingPage() {
  return (
    <Suspense>
      <OnlineBookingPageInner />
    </Suspense>
  );
}

function OnlineBookingPageInner() {
  const [step, setStep] = useState<Step>("location");

  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");

  useEffect(() => {
    if (forcedState === "location") {
      setStep("location");
    } else if (forcedState === "confirm") {
      setStep("confirm");
    } else if (forcedState === "confirmed") {
      setStep("confirmed");
    } else if (forcedState === "select") {
      setStep("select");
    }
  }, [forcedState]);

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (step === "confirm") setStep("select");
            else if (step === "select") setStep("location");
          }}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1">
            {step === "location" && (
              <>
                <Alert variant="info" className="mb-6">
                  <strong>Book Now:</strong> Self-paying clients are required to make payment at the time of service.
                </Alert>

                <h1 className="mb-6 text-display-lg text-text">Select a location</h1>

                <div className="space-y-3">
                  {mockLocations.map((loc) => {
                    const isSelected = selectedLocation === loc.id;
                    return (
                      <div
                        key={loc.id}
                        className={`flex items-center gap-4 rounded-lg border p-4 ${
                          isSelected ? "border-primary" : "border-border"
                        }`}
                      >
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800 text-2xl">
                          🔥
                        </div>
                        <div className="flex-1">
                          <div className="text-heading-sm text-text">{loc.name}</div>
                          <div className="text-body-md text-text-secondary">{loc.description}</div>
                        </div>
                        {isSelected ? (
                          <Button variant="secondary" className="border-primary text-primary">
                            Selected
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => setSelectedLocation(loc.id)}
                          >
                            Select
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {step === "select" && (
              <>
                <h1 className="mb-6 text-display-lg text-text">Select an appointment</h1>

                {/* Filters */}
                <div className="mb-4 flex gap-3">
                  <div className="flex-1 rounded-lg border border-border px-3 py-2 text-body-md text-text-secondary">
                    <User className="mr-2 inline h-4 w-4" />
                    All practitioners
                  </div>
                  <div className="flex-1 rounded-lg border border-border px-3 py-2 text-body-md text-text-secondary">
                    <Calendar className="mr-2 inline h-4 w-4" />
                    Any date
                  </div>
                  <div className="flex-1 rounded-lg border border-border px-3 py-2 text-body-md text-text-secondary">
                    <Clock className="mr-2 inline h-4 w-4" />
                    Any time
                  </div>
                </div>

                <p className="mb-8 text-caption-md text-text-secondary">
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
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-label-lg text-text-secondary">
                                {prac.name[0]}
                              </div>
                            ) : (
                              <Avatar name={prac.name} color={prac.color} size="md" />
                            )}
                            <div>
                              <div className="text-heading-sm text-text">{prac.name}</div>
                              <div className="text-caption-md text-text-secondary">{prac.role}</div>
                            </div>
                          </div>
                          {prac.tagline && (
                            <div className="text-caption-md text-text-secondary">{prac.tagline}</div>
                          )}
                        </div>

                        {/* Date/time picker */}
                        <div className="flex-1">
                          <div className="mb-2 text-heading-sm text-text">March 2026</div>
                          <div className="mb-4 flex items-center gap-1">
                            <Button variant="icon" round>
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {weekDays.map((d) => (
                              <Button
                                key={d.date}
                                variant="ghost"
                                round
                                onClick={() => {
                                  setSelectedDate(d.date);
                                  setSelectedPractitioner(prac.id);
                                }}
                                className={`flex h-10 w-10 flex-col items-center justify-center text-caption-md ${
                                  selectedDate === d.date && selectedPractitioner === prac.id
                                    ? "bg-primary text-white hover:bg-primary"
                                    : ""
                                }`}
                              >
                                <span className="text-caption-sm">{d.date}</span>
                              </Button>
                            ))}
                            <Button variant="icon" round>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mb-1 flex text-caption-sm text-text-secondary">
                            {weekDays.map((d) => (
                              <span key={d.date} className="w-10 text-center">
                                {d.day}
                              </span>
                            ))}
                          </div>

                          {hasSlots ? (
                            <div className="space-y-2">
                              {(showAllTimes ? availableSlots : availableSlots.slice(0, 4)).map((slot) => (
                                <Button
                                  key={slot}
                                  variant="secondary"
                                  className="w-28 hover:border-primary hover:bg-primary/10"
                                  onClick={() => {
                                    setSelectedTime(slot);
                                    setSelectedPractitioner(prac.id);
                                    setStep("confirm");
                                  }}
                                >
                                  {slot}
                                </Button>
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
                              <p className="text-body-md text-text-secondary">
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
                <h1 className="mb-6 text-display-lg text-text">Confirm your appointment</h1>

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
                      <label className="mb-1 block text-label-lg text-text-secondary">Phone number *</label>
                      <div className="flex gap-2">
                        <FormSelect
                          options={[
                            { value: "+61", label: "+61" },
                            { value: "+64", label: "+64" },
                            { value: "+1", label: "+1" },
                          ]}
                          value={phoneCode}
                          onChange={(e) => setPhoneCode(e.target.value)}
                          className="w-20"
                        />
                        <FormInput
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1"
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
                    <label className="mb-1 block text-label-lg text-text-secondary">Date of birth *</label>
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
                    <FormTextarea
                      label="Comments (optional)"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      maxLength={500}
                      rows={4}
                    />
                    <div className="mt-1 text-right text-caption-md text-text-secondary">
                      {comments.length} / 500
                    </div>
                  </div>

                  <Checkbox
                    label="Remember my details for next time"
                    checked={rememberDetails}
                    onChange={(e) => setRememberDetails(e.target.checked)}
                  />
                </div>
              </>
            )}

            {step === "confirmed" && (
              <>
                <div className="mx-auto max-w-lg text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h1 className="mb-2 text-display-lg text-text">Booking confirmed!</h1>
                  <p className="mb-6 text-body-lg text-text-secondary">
                    Your appointment has been booked. A confirmation email has been sent to <span className="text-body-lg-strong text-text">{email}</span>.
                  </p>

                  {/* Confirmation details card */}
                  <div className="mb-6 rounded-xl border border-border bg-gray-50 p-5 text-left">
                    <h3 className="mb-3 text-heading-sm text-text">Appointment details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-body-md text-text-secondary">Service</span>
                        <span className="text-body-md text-text">1:1 Consultation (40 mins)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-md text-text-secondary">Practitioner</span>
                        <span className="text-body-md text-text">{selectedPrac?.name ?? "Hrishikesh Koli"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-md text-text-secondary">Date</span>
                        <span className="text-body-md text-text">Thursday 19 March 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-md text-text-secondary">Time</span>
                        <span className="text-body-md text-text">{selectedTime ?? "9:20am"} — 10:00am</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-md text-text-secondary">Location</span>
                        <span className="text-body-md text-text">{mockLocations.find((l) => l.id === selectedLocation)?.name ?? "Tasks"}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2">
                        <span className="text-label-lg text-text">Total</span>
                        <span className="text-heading-sm text-text">A$148.71</span>
                      </div>
                    </div>
                  </div>

                  {/* Email preview card */}
                  <div className="mb-6 rounded-xl border border-border bg-white p-5 text-left">
                    <div className="mb-3 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-text-secondary" />
                      <h3 className="text-heading-sm text-text">Confirmation email sent</h3>
                    </div>
                    <div className="rounded-lg border border-border bg-gray-50 p-4">
                      <div className="mb-3 space-y-1 border-b border-border pb-3">
                        <div className="flex gap-2 text-body-sm">
                          <span className="text-text-secondary">From:</span>
                          <span className="text-text">noreply@splose.com</span>
                        </div>
                        <div className="flex gap-2 text-body-sm">
                          <span className="text-text-secondary">To:</span>
                          <span className="text-text">{email}</span>
                        </div>
                        <div className="flex gap-2 text-body-sm">
                          <span className="text-text-secondary">Subject:</span>
                          <span className="text-body-sm-strong text-text">Appointment confirmed — Thu 19 Mar, {selectedTime ?? "9:20am"}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-body-sm text-text">
                        <p>Hi {firstName},</p>
                        <p>Your appointment has been confirmed with the following details:</p>
                        <div className="my-3 rounded-lg bg-white p-3 text-body-sm">
                          <p><span className="text-text-secondary">Service:</span> 1:1 Consultation (40 mins)</p>
                          <p><span className="text-text-secondary">Practitioner:</span> {selectedPrac?.name ?? "Hrishikesh Koli"}</p>
                          <p><span className="text-text-secondary">When:</span> Thursday 19 March 2026 at {selectedTime ?? "9:20am"}</p>
                          <p><span className="text-text-secondary">Where:</span> {mockLocations.find((l) => l.id === selectedLocation)?.name ?? "Tasks"}</p>
                        </div>
                        <p>If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</p>
                        <p className="text-text-secondary">— The splose team</p>
                      </div>
                    </div>
                  </div>

                  {/* Add to calendar actions */}
                  <div className="flex flex-col items-center gap-3">
                    <h3 className="text-heading-sm text-text">Add to your calendar</h3>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <CalendarPlus className="h-4 w-4" />
                        Google Calendar
                      </Button>
                      <Button variant="secondary" size="sm">
                        <CalendarPlus className="h-4 w-4" />
                        Apple Calendar
                      </Button>
                      <Button variant="secondary" size="sm">
                        <CalendarPlus className="h-4 w-4" />
                        Outlook
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Copy className="h-4 w-4" />
                        Copy .ics
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button variant="primary" onClick={() => setStep("select")} className="w-full justify-center">
                      Book another appointment
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar — Appointment summary */}
          <div className={`w-72 shrink-0 ${step === "confirmed" ? "hidden" : ""}`}>
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-heading-md text-text">Appointment summary</h2>

              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${step === "location" ? "bg-primary" : selectedLocation ? "bg-primary" : "bg-gray-300"}`} />
                  <div className="flex-1">
                    <div className="text-heading-sm text-text">Location</div>
                    {selectedLocation && (
                      <div className="flex items-center gap-1.5 text-caption-md text-text-secondary">
                        <MapPin className="h-3 w-3" /> {mockLocations.find((l) => l.id === selectedLocation)?.name}
                      </div>
                    )}
                  </div>
                  {selectedLocation && step !== "location" && (
                    <Button variant="ghost" size="sm" className="text-text-secondary" onClick={() => setStep("location")}>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z" />
                      </svg>
                    </Button>
                  )}
                </div>

                {/* Service */}
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${step === "location" ? "bg-gray-300" : "bg-gray-300"}`} />
                  <div className="flex-1">
                    <div className={`text-heading-sm ${step === "location" ? "text-text-secondary" : "text-text"}`}>Service</div>
                    {step !== "location" && (
                      <>
                        <div className="flex items-center gap-1.5 text-caption-md text-text-secondary">
                          <FileText className="h-3 w-3" /> 1:1 Consultation (40 mins d...
                        </div>
                        <div className="flex items-center gap-1.5 text-caption-md text-text-secondary">
                          <span className="h-3 w-3 text-center">$</span> A$148.71
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Appointment */}
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${step === "confirm" ? "bg-primary" : "bg-gray-300"}`} />
                  <div className="flex-1">
                    <div className={`text-heading-sm ${step === "location" ? "text-text-secondary" : "text-text"}`}>Appointment</div>
                    {step === "confirm" && selectedPrac && (
                      <>
                        <div className="flex items-center gap-1.5 text-caption-md text-text-secondary">
                          <User className="h-3 w-3" /> {selectedPrac.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-caption-md text-text-secondary">
                          <Clock className="h-3 w-3" /> {selectedTime}
                        </div>
                        <div className="flex items-center gap-1.5 text-caption-md text-text-secondary">
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
                    <div className={`text-body-md ${step === "location" ? "text-text-secondary" : "text-text-secondary"}`}>Booking details</div>
                    {step === "confirm" && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-label-lg text-text">Total:</span>
                        <span className="text-heading-sm text-text">A$148.71</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="mt-6">
                {step === "location" ? (
                  <Button
                    variant={selectedLocation ? "primary" : "secondary"}
                    disabled={!selectedLocation}
                    className={`w-full justify-center ${!selectedLocation ? "bg-gray-200 text-gray-400 hover:bg-gray-200" : ""}`}
                    onClick={() => selectedLocation && setStep("select")}
                  >
                    Continue
                  </Button>
                ) : step === "select" ? (
                  <Button
                    variant="secondary"
                    disabled
                    className="w-full justify-center bg-gray-200 text-gray-400 hover:bg-gray-200"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button variant="primary" className="w-full justify-center" onClick={() => setStep("confirmed")}>
                    Confirm
                  </Button>
                )}
              </div>

              {step === "select" && (
                <p className="mt-3 text-center text-caption-md text-text-secondary">
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
        <div className="mt-16 pb-8 text-center text-body-md text-text-secondary">
          Powered by <span className="text-body-md-strong text-primary">splose</span>
        </div>
      </div>
    </div>
  );
}
