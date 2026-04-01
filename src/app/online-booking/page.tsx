"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LeftOutlined, RightOutlined, EnvironmentOutlined, FileTextOutlined, ClockCircleOutlined, CalendarOutlined, UserOutlined, CheckCircleOutlined, MailOutlined, PlusOutlined, CopyOutlined } from "@ant-design/icons";
import { Avatar, Button, Checkbox, FormInput, FormSelect, FormTextarea, Alert } from "@/components/ds";
import styles from "./online-booking.module.css";

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
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back link — only shown when not on first step */}
        {step !== "location" && (
          <button
            onClick={() => {
              if (step === "confirm") setStep("select");
              else if (step === "select") setStep("location");
            }}
            className={`${styles.backButton} text-body-md text-text`}
          >
            <LeftOutlined style={{ fontSize: 16 }} /> Back
          </button>
        )}

        <div className={styles.mainLayout}>
          {/* Main content */}
          <div className={styles.mainContent}>
            {step === "location" && (
              <>
                <div className={styles.alertWrapper}>
                  <Alert variant="info">
                    <strong>Book Now:</strong> Self-paying clients are required to make payment at the time of service.
                  </Alert>
                </div>

                <h1 className={styles.pageTitle}>Select a location</h1>

                <div className={styles.locationList}>
                  {mockLocations.map((loc) => {
                    const isSelected = selectedLocation === loc.id;
                    return (
                      <div
                        key={loc.id}
                        className={`${styles.locationCard} ${isSelected ? styles.locationCardSelected : ""}`}
                      >
                        <div className={styles.locationIcon}>
                          🔥
                        </div>
                        <div className={styles.locationInfo}>
                          <div className="text-heading-sm text-text">{loc.name}</div>
                          <div className="text-body-md text-text-secondary">{loc.description}</div>
                        </div>
                        {isSelected ? (
                          <button className={styles.selectedBtn}>
                            <span className="text-body-lg">Selected</span>
                          </button>
                        ) : (
                          <button
                            className={styles.selectBtn}
                            onClick={() => setSelectedLocation(loc.id)}
                          >
                            <span className="text-body-lg">Select</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {step === "select" && (
              <>
                <h1 className={styles.pageTitle}>Select an appointment</h1>

                {/* Filters */}
                <div className={styles.filterRow}>
                  <div className={`${styles.filterItem} text-body-md text-text-secondary`}>
                    <UserOutlined style={{ fontSize: 16, marginRight: 8 }} />
                    All practitioners
                  </div>
                  <div className={`${styles.filterItem} text-body-md text-text-secondary`}>
                    <CalendarOutlined style={{ fontSize: 16, marginRight: 8 }} />
                    Any date
                  </div>
                  <div className={`${styles.filterItem} text-body-md text-text-secondary`}>
                    <ClockCircleOutlined style={{ fontSize: 16, marginRight: 8 }} />
                    Any time
                  </div>
                </div>

                <p className={`${styles.timezoneNote} text-caption-md text-text-secondary`}>
                  All times are shown in (GMT+10:30) – Adelaide
                </p>

                <hr className={styles.divider} />

                {/* Practitioner list */}
                <div className={styles.practitionerList}>
                  {practitioners.map((prac) => {
                    const hasSlots = prac.id === "1";
                    return (
                      <div key={prac.id} className={styles.practitionerRow}>
                        {/* Practitioner info */}
                        <div className={styles.practitionerInfo}>
                          <div className={styles.practitionerHeader}>
                            {prac.hasPhoto ? (
                              <div className={`${styles.practitionerAvatar} text-label-lg text-text-secondary`}>
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
                        <div className={styles.dateTimePicker}>
                          <div className="text-heading-sm text-text" style={{ marginBottom: 8 }}>March 2026</div>
                          <div className={styles.weekNav}>
                            <Button variant="icon" round>
                              <LeftOutlined style={{ fontSize: 16 }} />
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
                                className={`text-caption-md`}
                                style={{
                                  display: 'flex',
                                  height: 40,
                                  width: 40,
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  ...(selectedDate === d.date && selectedPractitioner === prac.id
                                    ? { background: 'var(--color-primary)', color: '#fff' }
                                    : {}),
                                }}
                              >
                                <span className="text-caption-sm">{d.date}</span>
                              </Button>
                            ))}
                            <Button variant="icon" round>
                              <RightOutlined style={{ fontSize: 16 }} />
                            </Button>
                          </div>
                          <div className={styles.dayLabels}>
                            {weekDays.map((d) => (
                              <span key={d.date} className={`${styles.dayLabel} text-caption-sm text-text-secondary`}>
                                {d.day}
                              </span>
                            ))}
                          </div>

                          {hasSlots ? (
                            <div className={styles.slotList}>
                              {(showAllTimes ? availableSlots : availableSlots.slice(0, 4)).map((slot) => (
                                <Button
                                  key={slot}
                                  variant="secondary"
                                  style={{ width: 112 }}
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
                                style={{ marginTop: 8 }}
                              >
                                {showAllTimes ? "Show fewer" : "See all times"}
                              </Button>
                            </div>
                          ) : (
                            <div className={styles.noSlotsMessage}>
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
                <h1 className={styles.pageTitle}>Confirm your appointment</h1>

                <div className={styles.confirmForm}>
                  <div className={styles.confirmFormFields}>
                    <div className={styles.formGrid2}>
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

                    <div className={styles.formGrid2}>
                      <div>
                        <label className={`${styles.labelBlock} text-label-lg text-text-secondary`}>Phone number *</label>
                        <div className={styles.phoneRow}>
                          <FormSelect
                            options={[
                              { value: "+61", label: "+61" },
                              { value: "+64", label: "+64" },
                              { value: "+1", label: "+1" },
                            ]}
                            value={phoneCode}
                            onChange={setPhoneCode}
                            style={{ width: 80 }}
                          />
                          <FormInput
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ flex: 1 }}
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
                      <label className={`${styles.labelBlock} text-label-lg text-text-secondary`}>Date of birth *</label>
                      <div className={styles.formGrid3}>
                        <FormSelect
                          options={Array.from({ length: 31 }, (_, i) => ({
                            value: String(i + 1),
                            label: String(i + 1),
                          }))}
                          value={dobDay}
                          onChange={setDobDay}
                        />
                        <FormSelect
                          options={[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December",
                          ].map((m) => ({ value: m, label: m }))}
                          value={dobMonth}
                          onChange={setDobMonth}
                        />
                        <FormSelect
                          options={Array.from({ length: 100 }, (_, i) => ({
                            value: String(2026 - i),
                            label: String(2026 - i),
                          }))}
                          value={dobYear}
                          onChange={setDobYear}
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
                      <div className={`${styles.charCount} text-caption-md text-text-secondary`}>
                        {comments.length} / 500
                      </div>
                    </div>

                    <Checkbox
                      label="Remember my details for next time"
                      checked={rememberDetails}
                      onChange={(e) => setRememberDetails(e.target.checked)}
                    />
                  </div>
                </div>
              </>
            )}

            {step === "confirmed" && (
              <>
                <div className={styles.confirmedWrapper}>
                  <div className={styles.successIcon}>
                    <div className={styles.successCircle}>
                      <CheckCircleOutlined style={{ fontSize: 32, color: "var(--color-green-600, #16a34a)" }} />
                    </div>
                  </div>
                  <h1 className={`${styles.confirmedTitle} ${styles.pageTitle}`}>Booking confirmed!</h1>
                  <p className={`${styles.confirmedSubtext} text-body-lg text-text-secondary`}>
                    Your appointment has been booked. A confirmation email has been sent to <span className="text-body-lg-strong text-text">{email}</span>.
                  </p>

                  {/* Confirmation details card */}
                  <div className={styles.detailsCard}>
                    <h3 className={`${styles.detailsTitle} text-heading-sm text-text`}>Appointment details</h3>
                    <div className={styles.detailRows}>
                      <div className={styles.detailRow}>
                        <span className="text-body-md text-text-secondary">Service</span>
                        <span className="text-body-md text-text">1:1 Consultation (40 mins)</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className="text-body-md text-text-secondary">Practitioner</span>
                        <span className="text-body-md text-text">{selectedPrac?.name ?? "Hrishikesh Koli"}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className="text-body-md text-text-secondary">Date</span>
                        <span className="text-body-md text-text">Thursday 19 March 2026</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className="text-body-md text-text-secondary">Time</span>
                        <span className="text-body-md text-text">{selectedTime ?? "9:20am"} — 10:00am</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className="text-body-md text-text-secondary">Location</span>
                        <span className="text-body-md text-text">{mockLocations.find((l) => l.id === selectedLocation)?.name ?? "Tasks"}</span>
                      </div>
                      <div className={styles.totalRow}>
                        <span className="text-label-lg text-text">Total</span>
                        <span className="text-heading-sm text-text">A$148.71</span>
                      </div>
                    </div>
                  </div>

                  {/* Email preview card */}
                  <div className={styles.emailCard}>
                    <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <MailOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)" }} />
                      <h3 className="text-heading-sm text-text">Confirmation email sent</h3>
                    </div>
                    <div className={styles.emailBody}>
                      <div className={styles.emailHeader}>
                        <div className={`${styles.emailRow} text-body-sm`}>
                          <span className="text-text-secondary">From:</span>
                          <span className="text-text">noreply@splose.com</span>
                        </div>
                        <div className={`${styles.emailRow} text-body-sm`}>
                          <span className="text-text-secondary">To:</span>
                          <span className="text-text">{email}</span>
                        </div>
                        <div className={`${styles.emailRow} text-body-sm`}>
                          <span className="text-text-secondary">Subject:</span>
                          <span className="text-body-sm-strong text-text">Appointment confirmed — Thu 19 Mar, {selectedTime ?? "9:20am"}</span>
                        </div>
                      </div>
                      <div className={`${styles.emailContent} text-body-sm text-text`}>
                        <p>Hi {firstName},</p>
                        <p>Your appointment has been confirmed with the following details:</p>
                        <div className={styles.emailServiceBox}>
                          <p className="text-body-sm"><span className="text-text-secondary">Service:</span> 1:1 Consultation (40 mins)</p>
                          <p className="text-body-sm"><span className="text-text-secondary">Practitioner:</span> {selectedPrac?.name ?? "Hrishikesh Koli"}</p>
                          <p className="text-body-sm"><span className="text-text-secondary">When:</span> Thursday 19 March 2026 at {selectedTime ?? "9:20am"}</p>
                          <p className="text-body-sm"><span className="text-text-secondary">Where:</span> {mockLocations.find((l) => l.id === selectedLocation)?.name ?? "Tasks"}</p>
                        </div>
                        <p>If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</p>
                        <p className="text-text-secondary">— The splose team</p>
                      </div>
                    </div>
                  </div>

                  {/* Add to calendar actions */}
                  <div className={styles.calendarActions}>
                    <h3 className="text-heading-sm text-text">Add to your calendar</h3>
                    <div className={styles.calendarButtons}>
                      <Button variant="secondary" size="sm">
                        <PlusOutlined style={{ fontSize: 16 }} />
                        Google Calendar
                      </Button>
                      <Button variant="secondary" size="sm">
                        <PlusOutlined style={{ fontSize: 16 }} />
                        Apple Calendar
                      </Button>
                      <Button variant="secondary" size="sm">
                        <PlusOutlined style={{ fontSize: 16 }} />
                        Outlook
                      </Button>
                      <Button variant="secondary" size="sm">
                        <CopyOutlined style={{ fontSize: 16 }} />
                        Copy .ics
                      </Button>
                    </div>
                  </div>

                  <div className={styles.bookAnotherWrapper}>
                    <Button variant="primary" onClick={() => setStep("select")} style={{ width: '100%', justifyContent: 'center' }}>
                      Book another appointment
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar — Appointment summary */}
          <div className={`${styles.sidebar} ${step === "confirmed" ? styles.sidebarHidden : ""}`}>
            <div className={styles.sidebarCard}>
              <h2 className={`${styles.sidebarTitle} text-text`}>Appointment summary</h2>

              <div className={styles.stepperContainer}>
                {/* Vertical connector line between stepper dots */}
                <div className={styles.stepperLine} />

                {/* Location */}
                <div className={styles.stepperItem}>
                  <div className={`${styles.stepperDot} ${step === "location" || selectedLocation ? styles.stepperDotActive : ""}`} />
                  <div className={styles.stepperContent}>
                    <div className="text-heading-sm text-text">Location</div>
                    {selectedLocation && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="text-caption-md text-text-secondary">
                        <EnvironmentOutlined style={{ fontSize: 12 }} /> {mockLocations.find((l) => l.id === selectedLocation)?.name}
                      </div>
                    )}
                  </div>
                  {selectedLocation && step !== "location" && (
                    <Button variant="ghost" size="sm" className="text-text-secondary" onClick={() => setStep("location")}>
                      <svg className={styles.editSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z" />
                      </svg>
                    </Button>
                  )}
                </div>

                {/* Service */}
                <div className={styles.stepperItem}>
                  <div className={styles.stepperDot} />
                  <div className={styles.stepperContent}>
                    <div className={`text-heading-sm ${step === "location" ? "text-text-secondary" : "text-text"}`}>Service</div>
                    {step !== "location" && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="text-caption-md text-text-secondary">
                          <FileTextOutlined style={{ fontSize: 12 }} /> 1:1 Consultation (40 mins d...
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="text-caption-md text-text-secondary">
                          <span style={{ width: 12, textAlign: "center", fontSize: 12 }}>$</span> A$148.71
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Appointment */}
                <div className={styles.stepperItem}>
                  <div className={`${styles.stepperDot} ${step === "confirm" ? styles.stepperDotActive : ""}`} />
                  <div className={styles.stepperContent}>
                    <div className={`text-heading-sm ${step === "location" ? "text-text-secondary" : "text-text"}`}>Appointment</div>
                    {step === "confirm" && selectedPrac && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="text-caption-md text-text-secondary">
                          <UserOutlined style={{ fontSize: 12 }} /> {selectedPrac.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="text-caption-md text-text-secondary">
                          <ClockCircleOutlined style={{ fontSize: 12 }} /> {selectedTime}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="text-caption-md text-text-secondary">
                          <CalendarOutlined style={{ fontSize: 12 }} /> Thursday 19 March 2026
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Booking details */}
                <div className={styles.stepperItem}>
                  <div className={`${styles.stepperDot} ${step === "confirm" ? styles.stepperDotActive : ""}`} />
                  <div className={styles.stepperContent}>
                    <div className="text-body-md text-text-secondary">Booking details</div>
                    {step === "confirm" && (
                      <div className={styles.totalLine}>
                        <span className="text-label-lg text-text">Total:</span>
                        <span className="text-heading-sm text-text">A$148.71</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className={styles.actionWrapper}>
                {step === "location" ? (
                  selectedLocation ? (
                    <Button
                      variant="primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => setStep("select")}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      disabled
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Continue
                    </Button>
                  )
                ) : step === "select" ? (
                  <Button
                    variant="primary"
                    disabled
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep("confirmed")}>
                    Confirm
                  </Button>
                )}
              </div>

              {step === "select" && (
                <p className={`${styles.waitlistNote} text-caption-md text-text-secondary`}>
                  Can&apos;t find a suitable time?{" "}
                  <a href="#" className={styles.waitlistLink}>
                    Join the waitlist.
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${styles.footer} text-body-md text-text-secondary`}>
          Powered by <span className="text-body-md-strong text-primary">splose</span>
        </div>
      </div>
    </div>
  );
}
