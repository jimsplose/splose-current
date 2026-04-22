"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LeftOutlined, RightOutlined, EnvironmentOutlined, FileTextOutlined, ClockCircleOutlined, CalendarOutlined, UserOutlined, CheckCircleOutlined, MailOutlined, PlusOutlined, CopyOutlined, BankOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Avatar, Button, Checkbox, FormInput, FormSelect, FormTextarea, Text } from "@/components/ds";
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
            className={styles.backButton}
          >
            <LeftOutlined style={{ fontSize: 16 }} /> <Text variant="body/md" as="span">Back</Text>
          </button>
        )}

        <div className={styles.mainLayout}>
          {/* Main content */}
          <div className={styles.mainContent}>
            {step === "location" && (
              <>
                <div className={styles.alertWrapper}>
                  <div className={styles.bookNowBanner} role="note">
                    <strong>Book Now:</strong> Self-paying clients are required to make payment at the time of service.
                  </div>
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
                          <BankOutlined style={{ fontSize: 32 }} />
                        </div>
                        <div className={styles.locationInfo}>
                          <span className={styles.locationName}>{loc.name}</span>
                          <Text variant="body/md" as="div" color="secondary" className={styles.locationSubtitle}>{loc.description}</Text>
                        </div>
                        {isSelected ? (
                          <button className={styles.selectedBtn}>
                            <Text variant="body/lg" as="span">Selected</Text>
                          </button>
                        ) : (
                          <button
                            className={styles.selectBtn}
                            onClick={() => setSelectedLocation(loc.id)}
                          >
                            <Text variant="body/lg" as="span">Select</Text>
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
                  <div className={styles.filterItem}>
                    <UserOutlined className="mr-2" style={{ fontSize: 16 }} />
                    <Text variant="body/md" as="span" color="secondary">All practitioners</Text>
                  </div>
                  <div className={styles.filterItem}>
                    <CalendarOutlined className="mr-2" style={{ fontSize: 16 }} />
                    <Text variant="body/md" as="span" color="secondary">Any date</Text>
                  </div>
                  <div className={styles.filterItem}>
                    <ClockCircleOutlined className="mr-2" style={{ fontSize: 16 }} />
                    <Text variant="body/md" as="span" color="secondary">Any time</Text>
                  </div>
                </div>

                <Text variant="caption/md" as="p" color="secondary" className={styles.timezoneNote}>
                  All times are shown in (GMT+10:30) – Adelaide
                </Text>

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
                              <div className={styles.practitionerAvatar}>
                                <Text variant="label/lg" as="span" color="secondary">{prac.name[0]}</Text>
                              </div>
                            ) : (
                              <Avatar name={prac.name} color={prac.color} size="md" />
                            )}
                            <div>
                              <Text variant="heading/sm" as="div">{prac.name}</Text>
                              <Text variant="caption/md" as="div" color="secondary">{prac.role}</Text>
                            </div>
                          </div>
                          {prac.tagline && (
                            <Text variant="caption/md" as="div" color="secondary">{prac.tagline}</Text>
                          )}
                        </div>

                        {/* Date/time picker */}
                        <div className={styles.dateTimePicker}>
                          <Text variant="heading/sm" as="div" style={{ marginBottom: 8 }}>March 2026</Text>
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
                                className="flex flex-col items-center justify-center"
                                style={{
                                  height: 40,
                                  width: 40,
                                  ...(selectedDate === d.date && selectedPractitioner === prac.id
                                    ? { background: 'var(--color-primary)', color: '#fff' }
                                    : {}),
                                }}
                              >
                                <Text variant="caption/sm" as="span">{d.date}</Text>
                              </Button>
                            ))}
                            <Button variant="icon" round>
                              <RightOutlined style={{ fontSize: 16 }} />
                            </Button>
                          </div>
                          <div className={styles.dayLabels}>
                            {weekDays.map((d) => (
                              <Text key={d.date} variant="caption/sm" as="span" color="secondary" className={styles.dayLabel}>
                                {d.day}
                              </Text>
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
                              <Text variant="body/md" color="secondary">
                                No available times for your search. Please try a different date or join the waitlist to be
                                notified if a spot opens.
                              </Text>
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
                        <Text variant="label/lg" as="label" color="secondary" className={styles.labelBlock}>Phone number *</Text>
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
                      <Text variant="label/lg" as="label" color="secondary" className={styles.labelBlock}>Date of birth *</Text>
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
                      <Text variant="caption/md" as="div" color="secondary" className={styles.charCount}>
                        {comments.length} / 500
                      </Text>
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
                  <Text variant="body/lg" color="secondary" className={styles.confirmedSubtext}>
                    Your appointment has been booked. A confirmation email has been sent to <Text variant="body/lg-strong" as="span">{email}</Text>.
                  </Text>

                  {/* Confirmation details card */}
                  <div className={styles.detailsCard}>
                    <Text variant="heading/sm" as="h3" className={styles.detailsTitle}>Appointment details</Text>
                    <div className={styles.detailRows}>
                      <div className={styles.detailRow}>
                        <Text variant="body/md" as="span" color="secondary">Service</Text>
                        <Text variant="body/md" as="span">1:1 Consultation (40 mins)</Text>
                      </div>
                      <div className={styles.detailRow}>
                        <Text variant="body/md" as="span" color="secondary">Practitioner</Text>
                        <Text variant="body/md" as="span">{selectedPrac?.name ?? "Hrishikesh Koli"}</Text>
                      </div>
                      <div className={styles.detailRow}>
                        <Text variant="body/md" as="span" color="secondary">Date</Text>
                        <Text variant="body/md" as="span">Thursday 19 March 2026</Text>
                      </div>
                      <div className={styles.detailRow}>
                        <Text variant="body/md" as="span" color="secondary">Time</Text>
                        <Text variant="body/md" as="span">{selectedTime ?? "9:20am"} — 10:00am</Text>
                      </div>
                      <div className={styles.detailRow}>
                        <Text variant="body/md" as="span" color="secondary">Location</Text>
                        <Text variant="body/md" as="span">{mockLocations.find((l) => l.id === selectedLocation)?.name ?? "Tasks"}</Text>
                      </div>
                      <div className={styles.totalRow}>
                        <Text variant="label/lg" as="span">Total</Text>
                        <Text variant="heading/sm" as="span">A$148.71</Text>
                      </div>
                    </div>
                  </div>

                  {/* Email preview card */}
                  <div className={styles.emailCard}>
                    <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
                      <MailOutlined style={{ fontSize: 16, color: "var(--color-text-secondary)" }} />
                      <Text variant="heading/sm" as="h3">Confirmation email sent</Text>
                    </Flex>
                    <div className={styles.emailBody}>
                      <div className={styles.emailHeader}>
                        <div className={styles.emailRow}>
                          <Text variant="body/sm" as="span" color="secondary">From:</Text>
                          <Text variant="body/sm" as="span">noreply@splose.com</Text>
                        </div>
                        <div className={styles.emailRow}>
                          <Text variant="body/sm" as="span" color="secondary">To:</Text>
                          <Text variant="body/sm" as="span">{email}</Text>
                        </div>
                        <div className={styles.emailRow}>
                          <Text variant="body/sm" as="span" color="secondary">Subject:</Text>
                          <Text variant="body/md-strong" as="span">Appointment confirmed — Thu 19 Mar, {selectedTime ?? "9:20am"}</Text>
                        </div>
                      </div>
                      <div className={styles.emailContent}>
                        <Text variant="body/sm" as="p">Hi {firstName},</Text>
                        <Text variant="body/sm" as="p">Your appointment has been confirmed with the following details:</Text>
                        <div className={styles.emailServiceBox}>
                          <Text variant="body/sm" as="p"><Text variant="body/sm" as="span" color="secondary">Service:</Text> 1:1 Consultation (40 mins)</Text>
                          <Text variant="body/sm" as="p"><Text variant="body/sm" as="span" color="secondary">Practitioner:</Text> {selectedPrac?.name ?? "Hrishikesh Koli"}</Text>
                          <Text variant="body/sm" as="p"><Text variant="body/sm" as="span" color="secondary">When:</Text> Thursday 19 March 2026 at {selectedTime ?? "9:20am"}</Text>
                          <Text variant="body/sm" as="p"><Text variant="body/sm" as="span" color="secondary">Where:</Text> {mockLocations.find((l) => l.id === selectedLocation)?.name ?? "Tasks"}</Text>
                        </div>
                        <Text variant="body/sm" as="p">If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</Text>
                        <Text variant="body/sm" as="p" color="secondary">— The splose team</Text>
                      </div>
                    </div>
                  </div>

                  {/* Add to calendar actions */}
                  <div className={styles.calendarActions}>
                    <Text variant="heading/sm" as="h3">Add to your calendar</Text>
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
              <h2 className={styles.sidebarTitle}>Appointment summary</h2>

              <div className={styles.stepperContainer}>
                {/* Vertical connector line between stepper dots */}
                <div className={styles.stepperLine} />

                {/* Location */}
                <div className={styles.stepperItem}>
                  <div className={`${styles.stepperDot} ${step === "location" || selectedLocation ? styles.stepperDotActive : ""}`} />
                  <div className={styles.stepperContent}>
                    <Text variant="heading/sm" as="div">Location</Text>
                    {selectedLocation && (
                      <Flex align="center" gap={6}>
                        <EnvironmentOutlined style={{ fontSize: 12 }} />
                        <Text variant="caption/md" as="span" color="secondary">{mockLocations.find((l) => l.id === selectedLocation)?.name}</Text>
                      </Flex>
                    )}
                  </div>
                  {selectedLocation && step !== "location" && (
                    <Button variant="ghost" size="sm" onClick={() => setStep("location")}>
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
                    <Text variant="heading/sm" as="div" color={step === "location" ? "secondary" : undefined}>Service</Text>
                    {step !== "location" && (
                      <>
                        <Flex align="center" gap={6}>
                          <FileTextOutlined style={{ fontSize: 12 }} />
                          <Text variant="caption/md" as="span" color="secondary">1:1 Consultation (40 mins d...</Text>
                        </Flex>
                        <Flex align="center" gap={6}>
                          <span className="text-center" style={{ width: 12, fontSize: 12 }}>$</span>
                          <Text variant="caption/md" as="span" color="secondary">A$148.71</Text>
                        </Flex>
                      </>
                    )}
                  </div>
                </div>

                {/* Appointment */}
                <div className={styles.stepperItem}>
                  <div className={`${styles.stepperDot} ${step === "confirm" ? styles.stepperDotActive : ""}`} />
                  <div className={styles.stepperContent}>
                    <Text variant="heading/sm" as="div" color={step === "location" ? "secondary" : undefined}>Appointment</Text>
                    {step === "confirm" && selectedPrac && (
                      <>
                        <Flex align="center" gap={6}>
                          <UserOutlined style={{ fontSize: 12 }} />
                          <Text variant="caption/md" as="span" color="secondary">{selectedPrac.name}</Text>
                        </Flex>
                        <Flex align="center" gap={6}>
                          <ClockCircleOutlined style={{ fontSize: 12 }} />
                          <Text variant="caption/md" as="span" color="secondary">{selectedTime}</Text>
                        </Flex>
                        <Flex align="center" gap={6}>
                          <CalendarOutlined style={{ fontSize: 12 }} />
                          <Text variant="caption/md" as="span" color="secondary">Thursday 19 March 2026</Text>
                        </Flex>
                      </>
                    )}
                  </div>
                </div>

                {/* Booking details */}
                <div className={styles.stepperItem}>
                  <div className={`${styles.stepperDot} ${step === "confirm" ? styles.stepperDotActive : ""}`} />
                  <div className={styles.stepperContent}>
                    <Text variant="body/md" as="div" color="secondary">Booking details</Text>
                    {step === "confirm" && (
                      <div className={styles.totalLine}>
                        <Text variant="label/lg" as="span">Total:</Text>
                        <Text variant="heading/sm" as="span">A$148.71</Text>
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
                      className={styles.continueFull}
                      style={{ width: "100%", height: 44, fontSize: 16 }}
                      onClick={() => setStep("select")}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      disabled
                      className={styles.continueFull}
                      style={{ width: "100%", height: 44, fontSize: 16 }}
                    >
                      Continue
                    </Button>
                  )
                ) : step === "select" ? (
                  <Button
                    variant="primary"
                    disabled
                    className={styles.continueFull}
                    style={{ width: "100%", height: 44, fontSize: 16 }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className={styles.continueFull}
                    style={{ width: "100%", height: 44, fontSize: 16 }}
                    onClick={() => setStep("confirmed")}
                  >
                    Confirm
                  </Button>
                )}
              </div>

              {step === "select" && (
                <Text variant="caption/md" as="p" color="secondary" className={styles.waitlistNote}>
                  Can&apos;t find a suitable time?{" "}
                  <a href="#" className={styles.waitlistLink}>
                    Join the waitlist.
                  </a>
                </Text>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Text variant="body/md" as="span" color="secondary">Powered by </Text>
          <Text variant="body/md-strong" as="span" color="primary">splose</Text>
        </div>
      </div>
    </div>
  );
}
