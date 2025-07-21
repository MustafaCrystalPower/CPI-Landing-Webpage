import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Users,
  Building2,
  TrendingUp,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FileUpload from "@/components/ui/file-upload";
import { toast } from "sonner";
import JobPostingsSection from "@/components/jobListings";
import { format } from "date-fns";
import InterviewScheduler from "./InterviewScheduler";

const Careers = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullNameEnglish: "",
    fullNameArabic: "",
    nationalId: "",
    dateOfBirth: "",
    mobileNumber: "",
    whatsappNumber: "",
    emailAddress: "",
    currentAddress: "",

    // Professional Information
    positionAppliedFor: "",
    yearsOfExperience: "",
    currentLastPosition: "",
    expectedSalary: "",

    // Skills & Qualifications
    highestEducationLevel: "",
    arabicProficiency: "",
    englishProficiency: "",
    keySkills: "",

    // Document Uploads
    introVideoLink: "",
    cvFile: null,
    certificationsFile: null,
    profilePicture: null,

    // Additional Information
    noticePeriod: "",
    joinReason: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedInterviewSlot, setSelectedInterviewSlot] = useState(null);

  // Validate current step before proceeding
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.fullNameEnglish.trim()) errors.fullNameEnglish = "Required";
      if (!formData.fullNameArabic.trim()) errors.fullNameArabic = "Required";
      if (!formData.nationalId.trim()) errors.nationalId = "Required";
      if (!formData.dateOfBirth) errors.dateOfBirth = "Required";
      if (!formData.mobileNumber.trim()) errors.mobileNumber = "Required";
      if (!formData.whatsappNumber.trim()) errors.whatsappNumber = "Required";
      if (!formData.emailAddress.trim()) errors.emailAddress = "Required";
      if (!formData.currentAddress.trim()) errors.currentAddress = "Required";
    }

    if (step === 2) {
      if (!formData.positionAppliedFor) errors.positionAppliedFor = "Required";
      if (!formData.yearsOfExperience.trim())
        errors.yearsOfExperience = "Required";
      if (!formData.currentLastPosition.trim())
        errors.currentLastPosition = "Required";
      if (!formData.expectedSalary) errors.expectedSalary = "Required";
    }

    if (step === 3) {
      if (!formData.highestEducationLevel)
        errors.highestEducationLevel = "Required";
      if (!formData.arabicProficiency) errors.arabicProficiency = "Required";
      if (!formData.englishProficiency) errors.englishProficiency = "Required";
      if (!formData.keySkills.trim()) errors.keySkills = "Required";
    }

    if (step === 4) {
      if (!formData.cvFile) errors.cvFile = "Required";
      if (!formData.profilePicture) errors.profilePicture = "Required";
      if (!formData.joinReason.trim()) errors.joinReason = "Required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is edited
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
    // Clear error when file is uploaded
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      toast.error("Please complete all required fields before proceeding");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Replace the existing handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedInterviewSlot) {
      toast.error("Please select an interview slot");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validate all steps (1-4)
    let isValid = true;
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      toast.error("Please complete all required fields before submitting");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create form data for submission
      const formDataToSend = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        if (
          key !== "cvFile" &&
          key !== "profilePicture" &&
          key !== "certificationsFile"
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Include the selected interview slot data
      formDataToSend.append("interviewSlotDate", selectedInterviewSlot.date);
      formDataToSend.append("interviewSlotTime", selectedInterviewSlot.time);
      formDataToSend.append("interviewSlotId", selectedInterviewSlot.id);

      // Append files
      if (formData.cvFile) {
        formDataToSend.append("cvFile", formData.cvFile);
      }
      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }
      if (formData.certificationsFile) {
        if (Array.isArray(formData.certificationsFile)) {
          formData.certificationsFile.forEach((file) => {
            formDataToSend.append("certificationsFiles", file);
          });
        } else {
          formDataToSend.append(
            "certificationsFiles",
            formData.certificationsFile
          );
        }
      }

      // Submit the application
      const applicationResponse = await fetch(
        "https://cpi-landing-webpage-backend-production.up.railway.app/api/applications",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!applicationResponse.ok) {
        throw new Error("Failed to submit application");
      }

      // After successful application submission, book the interview slot
      const bookingResponse = await fetch(
        "https://cpi-landing-webpage-backend-production.up.railway.app/api/interview-slots/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: selectedInterviewSlot.date,
            time: selectedInterviewSlot.time,
            applicantEmail: formData.emailAddress,
            applicantName: formData.fullNameEnglish,
          }),
        }
      );

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.error || "Failed to book interview slot");
      }

      toast.success("Application submitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formRef = useRef(null);

  // Scroll to the form when the current step changes
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentStep]);

  const benefits = [
    {
      title: "Competitive Compensation",
      description:
        "We offer competitive salaries and performance-based bonuses.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Professional Growth",
      description:
        "Continuous learning opportunities and career advancement paths.",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      title: "Team Environment",
      description:
        "Work with passionate professionals in a collaborative setting.",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your interest in joining Crystal Power Investments.
              We have received your application and will review it carefully.
            </p>
            <p className="text-gray-600 mb-8">
              Our HR team will contact you within 5-7 business days if your
              profile matches our requirements.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
              className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Stepper component
  const Stepper = () => (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex flex-col items-center relative z-10">
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base ${
                currentStep >= step
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            <span
              className={`text-xs md:text-sm mt-1 md:mt-2 text-center ${
                currentStep >= step
                  ? "text-gray-900 font-medium"
                  : "text-gray-500"
              }`}
            >
              {step === 1 && "Personal"}
              {step === 2 && "Professional"}
              {step === 3 && "Skills"}
              {step === 4 && "Documents"}
              {step === 5 && "Interview"}
            </span>
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
        <div
          className="absolute top-4 left-0 h-1 bg-gray-900 transition-all duration-300"
          style={{ width: `${(currentStep - 1) * 25}%` }} // Changed to 25% for 5 steps
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Be part of Crystal Power Investments and help shape the future of
            property investment. We're looking for passionate professionals to
            join our growing team.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">{benefit.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <JobPostingsSection />

        {/* Application Form */}
        <div id="application-form">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900" ref={formRef}>
                Job Application Form
              </CardTitle>
              <CardDescription>
                Please fill out all required fields. Fields marked with * are
                mandatory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stepper />
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullNameEnglish">
                          Full Name (English) *
                        </Label>
                        <Input
                          id="fullNameEnglish"
                          type="text"
                          required
                          value={formData.fullNameEnglish}
                          onChange={(e) =>
                            handleInputChange("fullNameEnglish", e.target.value)
                          }
                          className="mt-1"
                          error={formErrors.fullNameEnglish}
                        />
                        {formErrors.fullNameEnglish && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.fullNameEnglish}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="fullNameArabic">
                          Full Name (Arabic) *
                        </Label>
                        <Input
                          id="fullNameArabic"
                          type="text"
                          required
                          value={formData.fullNameArabic}
                          onChange={(e) =>
                            handleInputChange("fullNameArabic", e.target.value)
                          }
                          className="mt-1"
                          error={formErrors.fullNameArabic}
                        />
                        {formErrors.fullNameArabic && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.fullNameArabic}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="nationalId">National ID *</Label>
                        <Input
                          id="nationalId"
                          type="text"
                          required
                          value={formData.nationalId}
                          onChange={(e) =>
                            handleInputChange("nationalId", e.target.value)
                          }
                          className="mt-1"
                          error={formErrors.nationalId}
                        />
                        {formErrors.nationalId && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.nationalId}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          className="mt-1"
                          error={formErrors.dateOfBirth}
                        />
                        {formErrors.dateOfBirth && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.dateOfBirth}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mobileNumber">Mobile Number *</Label>
                        <Input
                          id="mobileNumber"
                          type="tel"
                          required
                          value={formData.mobileNumber}
                          onChange={(e) =>
                            handleInputChange("mobileNumber", e.target.value)
                          }
                          className="mt-1"
                          error={formErrors.mobileNumber}
                        />
                        {formErrors.mobileNumber && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.mobileNumber}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="whatsappNumber">
                          WhatsApp Number *
                        </Label>
                        <Input
                          id="whatsappNumber"
                          type="tel"
                          required
                          value={formData.whatsappNumber}
                          onChange={(e) =>
                            handleInputChange("whatsappNumber", e.target.value)
                          }
                          className="mt-1"
                          error={formErrors.whatsappNumber}
                        />
                        {formErrors.whatsappNumber && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.whatsappNumber}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="emailAddress">Email Address *</Label>
                        <Input
                          id="emailAddress"
                          type="email"
                          required
                          value={formData.emailAddress}
                          onChange={(e) =>
                            handleInputChange("emailAddress", e.target.value)
                          }
                          className="mt-1"
                          error={formErrors.emailAddress}
                        />
                        {formErrors.emailAddress && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.emailAddress}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="currentAddress">
                          Current Address *
                        </Label>
                        <Input
                          id="currentAddress"
                          type="text"
                          required
                          value={formData.currentAddress}
                          onChange={(e) =>
                            handleInputChange("currentAddress", e.target.value)
                          }
                          className="mt-1"
                          error={formErrors.currentAddress}
                        />
                        {formErrors.currentAddress && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.currentAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Step 2: Professional Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                      Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="positionAppliedFor">
                          Position Applied For *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("positionAppliedFor", value)
                          }
                          value={formData.positionAppliedFor}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Investment-Analyst">
                              Investment Analyst
                            </SelectItem>
                            <SelectItem value="Executive-Assistant">
                              Executive Assistant
                            </SelectItem>
                            <SelectItem value="School-Catering-Manager">
                              School Catering Manager
                            </SelectItem>
                            <SelectItem value="Marketing-Specialist">
                              Marketing Specialist
                            </SelectItem>
                            <SelectItem value="Graphic-Designer">
                              Graphic Designer
                            </SelectItem>
                            <SelectItem value="Software-Developer">
                              Software Developer
                            </SelectItem>
                            <SelectItem value="Cafe Manager">
                              Cafe Manager
                            </SelectItem>
                            <SelectItem value="HR-Talent-Aquisition">
                              HR Talent Aquisition
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.positionAppliedFor && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.positionAppliedFor}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="yearsOfExperience">
                          Years of Experience *
                        </Label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          required
                          value={formData.yearsOfExperience}
                          onChange={(e) =>
                            handleInputChange(
                              "yearsOfExperience",
                              e.target.value
                            )
                          }
                          className="mt-1"
                          placeholder="e.g., 5"
                          error={formErrors.yearsOfExperience}
                        />
                        {formErrors.yearsOfExperience && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.yearsOfExperience}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="currentLastPosition">
                          Current/Last Position *
                        </Label>
                        <Input
                          id="currentLastPosition"
                          type="text"
                          required
                          value={formData.currentLastPosition}
                          onChange={(e) =>
                            handleInputChange(
                              "currentLastPosition",
                              e.target.value
                            )
                          }
                          className="mt-1"
                          error={formErrors.currentLastPosition}
                        />
                        {formErrors.currentLastPosition && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.currentLastPosition}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="expectedSalary">
                          Expected Salary (EGP) *
                        </Label>
                        <Input
                          id="expectedSalary"
                          type="number"
                          required
                          value={formData.expectedSalary}
                          onChange={(e) =>
                            handleInputChange("expectedSalary", e.target.value)
                          }
                          className="mt-1"
                          placeholder="e.g., 15000"
                          error={formErrors.expectedSalary}
                        />
                        {formErrors.expectedSalary && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.expectedSalary}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Step 3: Skills & Qualifications */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                      Skills & Qualifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="highestEducationLevel">
                          Highest Education Level *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("highestEducationLevel", value)
                          }
                          value={formData.highestEducationLevel}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high-school">
                              High School
                            </SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="bachelor">
                              Bachelor's Degree
                            </SelectItem>
                            <SelectItem value="master">
                              Master's Degree
                            </SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.highestEducationLevel && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.highestEducationLevel}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="arabicProficiency">
                          Arabic Proficiency *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("arabicProficiency", value)
                          }
                          value={formData.arabicProficiency}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select proficiency level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="native">Native</SelectItem>
                            <SelectItem value="fluent">Fluent</SelectItem>
                            <SelectItem value="professional">
                              Professional
                            </SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.arabicProficiency && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.arabicProficiency}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="englishProficiency">
                          English Proficiency *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("englishProficiency", value)
                          }
                          value={formData.englishProficiency}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select proficiency level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="native">Native</SelectItem>
                            <SelectItem value="fluent">Fluent</SelectItem>
                            <SelectItem value="professional">
                              Professional
                            </SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.englishProficiency && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.englishProficiency}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="keySkills">
                          Key Skills (comma-separated) *
                        </Label>
                        <Textarea
                          id="keySkills"
                          required
                          value={formData.keySkills}
                          onChange={(e) =>
                            handleInputChange("keySkills", e.target.value)
                          }
                          className="mt-1"
                          placeholder="e.g., Financial Analysis, Project Management, Communication, Excel, PowerPoint"
                          rows={3}
                          error={formErrors.keySkills}
                        />
                        {formErrors.keySkills && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.keySkills}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Documents & Additional Info */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Document Uploads
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="introVideoLink">
                            Introduction Video Link (3 minutes max) - Optional
                          </Label>
                          <Input
                            id="introVideoLink"
                            type="url"
                            value={formData.introVideoLink}
                            onChange={(e) =>
                              handleInputChange(
                                "introVideoLink",
                                e.target.value
                              )
                            }
                            className="mt-1"
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FileUpload
                              id="cvFile"
                              accept=".pdf"
                              required
                              onChange={(file) =>
                                handleFileChange("cvFile", file)
                              }
                              label="Upload CV"
                              description="PDF format only"
                              maxSize="5MB"
                              value={formData.cvFile}
                              error={formErrors.cvFile}
                            />
                            {formErrors.cvFile && (
                              <p className="text-sm text-red-500 mt-1">
                                {formErrors.cvFile}
                              </p>
                            )}
                          </div>
                          <div>
                            <FileUpload
                              id="profilePicture"
                              accept="image/*"
                              required
                              onChange={(file) =>
                                handleFileChange("profilePicture", file)
                              }
                              label="Profile Picture"
                              description="Image format only"
                              maxSize="2MB"
                              value={formData.profilePicture}
                              error={formErrors.profilePicture}
                            />
                            {formErrors.profilePicture && (
                              <p className="text-sm text-red-500 mt-1">
                                {formErrors.profilePicture}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <FileUpload
                            id="certificationsFile"
                            accept=".pdf,image/*"
                            multiple
                            onChange={(files) =>
                              handleFileChange("certificationsFile", files)
                            }
                            label="Certifications (Optional)"
                            description="PDF or Image formats"
                            maxSize="10MB total"
                            value={formData.certificationsFile}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Additional Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="noticePeriod">
                            Notice Period (if currently employed)
                          </Label>
                          <Input
                            id="noticePeriod"
                            type="text"
                            value={formData.noticePeriod}
                            onChange={(e) =>
                              handleInputChange("noticePeriod", e.target.value)
                            }
                            className="mt-1"
                            placeholder="e.g., 1 month, 2 weeks, etc."
                          />
                        </div>
                        <div>
                          <Label htmlFor="joinReason">
                            Why do you want to join Crystal Power Investments? *
                          </Label>
                          <Textarea
                            id="joinReason"
                            required
                            value={formData.joinReason}
                            onChange={(e) =>
                              handleInputChange("joinReason", e.target.value)
                            }
                            className="mt-1"
                            placeholder="Tell us what motivates you to join our team and how you can contribute to our success..."
                            rows={4}
                            error={formErrors.joinReason}
                          />
                          {formErrors.joinReason && (
                            <p className="text-sm text-red-500 mt-1">
                              {formErrors.joinReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Interview Scheduler */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                      Schedule Your Interview
                    </h3>
                    <InterviewScheduler
                      onSlotSelect={(slot) => {
                        setSelectedInterviewSlot(slot);
                      }}
                    />

                    {selectedInterviewSlot && (
                      <div className="p-4 bg-blue-50 rounded-md">
                        <p className="font-medium">Selected Interview Slot:</p>
                        <p>
                          {format(
                            new Date(selectedInterviewSlot.date),
                            "EEEE, MMMM d, yyyy"
                          )}
                        </p>
                        <p>Time: {selectedInterviewSlot.time}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex items-center cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center bg-gray-900 hover:bg-gray-800 cursor-pointer"
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold cursor-pointer"
                      disabled={isSubmitting || !selectedInterviewSlot}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <>
                          Submit Application
                          <Upload className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Careers;
