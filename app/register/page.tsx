
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./register.css";

type Category =
  | "Men's Singles"
  | "Men's Doubles"
  | "Women's Singles"
  | "Women's Doubles"
  | "Mixed Doubles";

type Student = {
  name: string;
  enrollment: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
};

type Registration = {
  category: Category;
  player1: Student;
  player2: Student;
};

type StudentField = keyof Student;

const categories: Category[] = [
  "Men's Singles",
  "Men's Doubles",
  "Women's Singles",
  "Women's Doubles",
  "Mixed Doubles",
];

const departments = [
  "MBBS",
  "B.Sc Nursing",
  "GNM Nursing",
  "Allied Health Sciences",
  "Physiotherapy",
  "Medical Laboratory Technology",
  "Radiology and Imaging Technology",
  "Operation Theatre Technology",
  "Optometry",
  "Anaesthesia Technology",
  "Dialysis Technology",
  "Emergency Medical Services",
  "Pharmacy",
  "Other",
];

const academicYears = [
  "First Year",
  "Second Year",
  "Third Year",
  "Fourth Year",
  "Fifth Year",
  "Final Year",
  "Internship",
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
  "Semester 9",
  "Semester 10",
  "Other",
];

const emptyStudent: Student = {
  name: "",
  enrollment: "",
  email: "",
  phone: "",
  department: "",
  semester: "",
};

const initialRegistration: Registration = {
  category: "Men's Singles",
  player1: { ...emptyStudent },
  player2: { ...emptyStudent },
};

const fieldDefinitions: {
  key: StudentField;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  {
    key: "name",
    label: "Full name",
    placeholder: "Enter your name as per college records",
  },
  {
    key: "enrollment",
    label: "Enrollment number",
    placeholder: "Your college ID",
  },
  {
    key: "phone",
    label: "Mobile number",
    placeholder: "10-digit mobile number",
    type: "tel",
  },
  {
    key: "email",
    label: "College email address",
    placeholder: "you@example.com",
    type: "email",
  },
];

function isDoubles(category: Category) {
  return category.includes("Doubles");
}

function validateStudent(student: Student) {
  const errors: Partial<Record<StudentField, string>> = {};

  if (!student.name.trim()) {
    errors.name = "Please enter the full name.";
  }

  if (!student.enrollment.trim()) {
    errors.enrollment = "Please enter the enrollment number.";
  }

  if (!student.email.trim()) {
    errors.email = "Please enter the email address.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email.trim())
  ) {
    errors.email = "Please enter a valid email address.";
  }

  if (!student.phone.trim()) {
    errors.phone = "Please enter the mobile number.";
  } else if (!/^[6-9]\d{9}$/.test(student.phone.trim())) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (!student.department) {
    errors.department = "Please select a department.";
  }

  if (!student.semester) {
    errors.semester = "Please select a year or semester.";
  }

  return errors;
}

function CustomSelect({
  id,
  label,
  value,
  placeholder,
  options,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  error?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`field ${error ? "field-invalid" : ""}`}>
      <label className="field-label" id={`${id}-label`}>
        {label} <span className="required-star">*</span>
      </label>

      <div className="styled-select">
        <button
          type="button"
          className={`select-trigger ${value ? "has-value" : ""} ${
            open ? "select-open" : ""
          }`}
          aria-labelledby={`${id}-label`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          <span>{value || placeholder}</span>
          <span className="select-chevron" aria-hidden="true" />
        </button>

        {open && (
          <>
            <button
              type="button"
              className="select-backdrop"
              aria-label={`Close ${label} options`}
              onClick={() => setOpen(false)}
            />

            <div
              className="select-options"
              role="listbox"
              aria-labelledby={`${id}-label`}
            >
              {options.map((option) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={value === option}
                  className={`select-option ${
                    value === option ? "option-selected" : ""
                  }`}
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <span>{option}</span>

                  {value === option && (
                    <span className="option-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [registration, setRegistration] =
    useState<Registration>(initialRegistration);
  const [accepted, setAccepted] = useState(false);
  const [review, setReview] = useState(false);
  const [notice, setNotice] = useState("");

  const [errors, setErrors] = useState<{
    player1: Partial<Record<StudentField, string>>;
    player2: Partial<Record<StudentField, string>>;
    consent?: string;
  }>({
    player1: {},
    player2: {},
  });

  const { category, player1, player2 } = registration;
  const doubles = isDoubles(category);

  function updateCategory(value: Category) {
    setRegistration((current) => ({
      ...current,
      category: value,
    }));
    setNotice("");
    setErrors({ player1: {}, player2: {} });
  }

  function updateStudent(
    player: "player1" | "player2",
    field: StudentField,
    value: string
  ) {
    setRegistration((current) => ({
      ...current,
      [player]: {
        ...current[player],
        [field]: value,
      },
    }));

    setErrors((current) => ({
      ...current,
      [player]: {
        ...current[player],
        [field]: undefined,
      },
    }));

    setNotice("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    const player1Errors = validateStudent(player1);
    const player2Errors = doubles ? validateStudent(player2) : {};

    if (
      doubles &&
      player1.enrollment.trim() &&
      player2.enrollment.trim() &&
      player1.enrollment.trim().toLowerCase() ===
        player2.enrollment.trim().toLowerCase()
    ) {
      player2Errors.enrollment =
        "Players must have different enrollment numbers.";
    }

    const nextErrors = {
      player1: player1Errors,
      player2: player2Errors,
      consent: accepted
        ? undefined
        : "Please confirm that your details are correct.",
    };

    setErrors(nextErrors);

    const hasErrors =
      Object.keys(player1Errors).length > 0 ||
      Object.keys(player2Errors).length > 0 ||
      !accepted;

    if (hasErrors) {
      setNotice("Please check the highlighted fields and try again.");
      return;
    }

    setReview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEdit() {
    setReview(false);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    if (review) {
      handleEdit();
      return;
    }

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  function handleFinish() {
    setNotice(
      "Your details have been reviewed, but registration has not been saved. The database and registration API still need to be connected."
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderStudentFields(
    playerKey: "player1" | "player2",
    student: Student,
    playerErrors: Partial<Record<StudentField, string>>,
    partner = false
  ) {
    return (
      <div className="fields-grid">
        {fieldDefinitions.map((field) => {
          const id = `${playerKey}-${field.key}`;

          return (
            <div
              className={`field ${
                field.key === "name" || field.key === "email"
                  ? "field-full"
                  : ""
              }`}
              key={field.key}
            >
              <label className="field-label" htmlFor={id}>
                {partner
                  ? `Partner ${field.label.toLowerCase()}`
                  : field.label}{" "}
                <span className="required-star">*</span>
              </label>

              <input
                id={id}
                className="input"
                type={field.type || "text"}
                placeholder={
                  partner
                    ? field.key === "name"
                      ? "Partner's full name"
                      : field.key === "enrollment"
                        ? "Partner's college ID"
                        : field.key === "phone"
                          ? "Partner's 10-digit mobile number"
                          : "Partner's email address"
                    : field.placeholder
                }
                value={student[field.key]}
                onChange={(event) => {
                  let value = event.target.value;

                  if (field.key === "phone") {
                    value = value.replace(/\D/g, "").slice(0, 10);
                  }

                  updateStudent(playerKey, field.key, value);
                }}
                autoComplete={
                  field.key === "name"
                    ? "name"
                    : field.key === "email"
                      ? "email"
                      : field.key === "phone"
                        ? "tel"
                        : "off"
                }
                inputMode={field.key === "phone" ? "numeric" : undefined}
                aria-invalid={Boolean(playerErrors[field.key])}
                required
              />

              {playerErrors[field.key] && (
                <p className="field-error">{playerErrors[field.key]}</p>
              )}
            </div>
          );
        })}

        <CustomSelect
          id={`${playerKey}-department`}
          label={partner ? "Partner department" : "Department"}
          value={student.department}
          placeholder="Select department"
          options={departments}
          error={playerErrors.department}
          onChange={(value) =>
            updateStudent(playerKey, "department", value)
          }
        />

        <CustomSelect
          id={`${playerKey}-semester`}
          label={partner ? "Partner year / semester" : "Year / semester"}
          value={student.semester}
          placeholder="Select year or semester"
          options={academicYears}
          error={playerErrors.semester}
          onChange={(value) => updateStudent(playerKey, "semester", value)}
        />
      </div>
    );
  }

  function reviewField(label: string, value: string, full = false) {
    return (
      <div className={`review-field ${full ? "full" : ""}`} key={label}>
        <div className="review-label">{label}</div>
        <div className="review-value">{value || "Not provided"}</div>
      </div>
    );
  }

  function renderReviewStudent(student: Student, title: string) {
    return (
      <section className="review-section" key={title}>
        <h3 className="review-section-title">{title}</h3>
        <div className="review-grid">
          {reviewField("Full name", student.name, true)}
          {reviewField("Enrollment number", student.enrollment)}
          {reviewField("Mobile number", student.phone)}
          {reviewField("Email address", student.email, true)}
          {reviewField("Department", student.department)}
          {reviewField("Year / semester", student.semester)}
        </div>
      </section>
    );
  }

  return (
    <main className="registration-page">
      <header className="topbar">
  <nav aria-label="Breadcrumb" className="register-breadcrumb">
    <Link href="/">Home</Link>
    <span aria-hidden="true">/</span>
    <span aria-current="page">Register</span>
  </nav>
</header>

      <div className="page-wrap">
        <section className="intro">
          <h1 className="page-title">
            {review ? "Review your details." : "Register for the tournament."}
          </h1>
          <p className="intro-copy">
            {review
              ? "Check the complete information for your selected event before proceeding."
              : "Enter your student details, choose your event and review all information before proceeding."}
          </p>
        </section>

        <div className="workspace">
          <section className="form-panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">
                  {review ? "Registration summary" : "Player details"}
                </h2>
                <p className="panel-subtitle">
                  {review
                    ? "Your player and partner details are shown below."
                    : "Complete each required field below."}
                </p>
              </div>

              <span className="required-note">
                {review ? (
                  "Review"
                ) : (
                  <>
                    <span className="required-star">*</span> Required
                  </>
                )}
              </span>
            </div>

            {review ? (
              <>
                <div className="review-banner">
                  <h3 className="review-banner-title">
                    Check all details carefully
                  </h3>
                  <p className="review-banner-copy">
                    {doubles
                      ? "This is a doubles event. Both your details and your partner's details are included in this review."
                      : "This is a singles event. Review your personal and student information below."}
                  </p>
                </div>

                <div className="review-body">
                  <section className="review-section">
                    <h3 className="review-section-title">
                      Event information
                    </h3>
                    <div className="review-grid">
                      {reviewField("Selected category", category, true)}
                      {reviewField(
                        "Event format",
                        doubles ? "Doubles" : "Singles"
                      )}
                      {reviewField("College", "GMERS College, Valsad")}
                    </div>
                  </section>

                  {renderReviewStudent(
                    player1,
                    doubles ? "Player 1 details" : "Player details"
                  )}

                  {doubles &&
                    renderReviewStudent(player2, "Player 2 details · Partner")}

                  {notice && (
                    <div className="notice" role="status" aria-live="polite">
                      {notice}
                    </div>
                  )}

                  <div className="review-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={handleEdit}
                    >
                      Edit details
                    </button>
                    <button
                      type="button"
                      className="submit-button"
                      onClick={handleFinish}
                    >
                      Confirm details
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <form className="form-body" onSubmit={handleSubmit} noValidate>
                <h3 className="section-label">Select your event</h3>

                <div className="category-grid">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`category-option ${
                        category === item ? "selected" : ""
                      }`}
                      onClick={() => updateCategory(item)}
                      aria-pressed={category === item}
                    >
                      <span className="category-name">{item}</span>
                      <span className="category-type">
                        {item.includes("Doubles")
                          ? "Two-player event"
                          : "Individual event"}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="form-divider" />

                <h3 className="section-label">Student information</h3>
                {renderStudentFields("player1", player1, errors.player1)}

                {doubles && (
                  <>
                    <div className="form-divider" />
                    <h3 className="section-label">Partner information</h3>

                    <div className="partner-box">
                      <h4 className="partner-title">
                        Player 2 · Doubles partner
                      </h4>
                      <p className="partner-description">
                        Enter your partner's complete student and contact
                        details below.
                      </p>

                      {renderStudentFields(
                        "player2",
                        player2,
                        errors.player2,
                        true
                      )}
                    </div>
                  </>
                )}

                <div className="form-divider" />

                <label className="consent">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(event) => {
                      setAccepted(event.target.checked);
                      setErrors((current) => ({
                        ...current,
                        consent: undefined,
                      }));
                    }}
                  />
                  <span>
                    I confirm that the information provided is accurate and
                    understand that the tournament organizers may verify my
                    student details.
                  </span>
                </label>

                {errors.consent && (
                  <p className="field-error consent-error">
                    {errors.consent}
                  </p>
                )}

                {notice && (
                  <div className="notice" role="alert" aria-live="polite">
                    {notice}
                  </div>
                )}

                <div className="submit-row">
                  <p className="submit-hint">
                    You can review and edit your details before proceeding.
                  </p>
                  <button className="submit-button" type="submit">
                    Review registration
                  </button>
                </div>
              </form>
            )}
          </section>

          <aside className="side-panel">
            <div>
              <div className="side-kicker">Your registration</div>
              <h2 className="side-title">
                {review ? "Review summary." : "A quick overview."}
              </h2>
              <p className="side-copy">
                {review
                  ? "Check both players' information before proceeding."
                  : "Your selected event and student details update as you fill the form."}
              </p>

              <div className="side-divider" />

              <div className="summary-item">
                <div className="summary-label">Selected event</div>
                <div className="summary-value">{category}</div>
              </div>

              <div className="summary-item">
                <div className="summary-label">Event format</div>
                <div className="summary-value">
                  {doubles ? "Doubles team" : "Singles player"}
                </div>
              </div>

              <div className="summary-item">
                <div className="summary-label">Player 1</div>
                <div className="summary-value">
                  {player1.name.trim() || "Not entered yet"}
                </div>
              </div>

              {doubles && (
                <>
                  <div className="summary-item">
                    <div className="summary-label">Player 2 · Partner</div>
                    <div className="summary-value">
                      {player2.name.trim() || "Not entered yet"}
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Partner enrollment</div>
                    <div className="summary-value">
                      {player2.enrollment.trim() || "Not entered yet"}
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Partner department</div>
                    <div className="summary-value">
                      {player2.department || "Not selected yet"}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div>
              <div className="side-divider" />
              <div className="side-kicker">Before you proceed</div>
              <ul className="checklist">
                <li>
                  <span className="check-dot" />
                  <span>Use the correct college enrollment number.</span>
                </li>
                <li>
                  <span className="check-dot" />
                  <span>Check your contact details carefully.</span>
                </li>
                <li>
                  <span className="check-dot" />
                  <span>
                    {doubles
                      ? "Verify both players' details."
                      : "Confirm your selected singles category."}
                  </span>
                </li>
              </ul>
            </div>

            <div className="help-box">
              <h3 className="help-title">Need assistance?</h3>
              <p className="help-copy">
                Contact the tournament organizing team if you are unsure about
                your event category or student details.
              </p>
            </div>
          </aside>
        </div>

        <p className="footer-note">
          Dr Khel Utsav · GMERS College, Valsad
        </p>
      </div>
    </main>
  );
}
