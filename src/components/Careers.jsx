import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Users, Building2, TrendingUp, CheckCircle } from 'lucide-react'
import FileUpload from '@/components/ui/file-upload'

const Careers = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullNameEnglish: '',
    fullNameArabic: '',
    nationalId: '',
    dateOfBirth: '',
    
    // Contact Information
    mobileNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    currentAddress: '',
    
    // Professional Information
    positionAppliedFor: '',
    yearsOfExperience: '',
    currentLastPosition: '',
    expectedSalary: '',
    
    // Skills & Qualifications
    highestEducationLevel: '',
    languageProficiency: '',
    keySkills: '',
    
    // Document Uploads
    introVideoLink: '',
    cvFile: null,
    certificationsFile: null,
    profilePicture: null,
    
    // Additional Information
    noticePeriod: '',
    whyJoinCPI: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
  }

  const benefits = [
    {
      title: 'Competitive Compensation',
      description: 'We offer competitive salaries and performance-based bonuses.',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: 'Professional Growth',
      description: 'Continuous learning opportunities and career advancement paths.',
      icon: <Building2 className="w-6 h-6" />
    },
    {
      title: 'Team Environment',
      description: 'Work with passionate professionals in a collaborative setting.',
      icon: <Users className="w-6 h-6" />
    }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your interest in joining Crystal Power Investments. 
              We have received your application and will review it carefully.
            </p>
            <p className="text-gray-600 mb-8">
              Our HR team will contact you within 5-7 business days if your profile matches our requirements.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Be part of Crystal Power Investments and help shape the future of property investment. 
            We're looking for passionate professionals to join our growing team.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Job Application Form</CardTitle>
            <CardDescription>
              Please fill out all required fields. Fields marked with * are mandatory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullNameEnglish">Full Name (English) *</Label>
                    <Input
                      id="fullNameEnglish"
                      type="text"
                      required
                      value={formData.fullNameEnglish}
                      onChange={(e) => handleInputChange('fullNameEnglish', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fullNameArabic">Full Name (Arabic) *</Label>
                    <Input
                      id="fullNameArabic"
                      type="text"
                      required
                      value={formData.fullNameArabic}
                      onChange={(e) => handleInputChange('fullNameArabic', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationalId">National ID *</Label>
                    <Input
                      id="nationalId"
                      type="text"
                      required
                      value={formData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                    <Input
                      id="whatsappNumber"
                      type="tel"
                      required
                      value={formData.whatsappNumber}
                      onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailAddress">Email Address *</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      required
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentAddress">Current Address *</Label>
                    <Input
                      id="currentAddress"
                      type="text"
                      required
                      value={formData.currentAddress}
                      onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="positionAppliedFor">Position Applied For *</Label>
                    <Select onValueChange={(value) => handleInputChange('positionAppliedFor', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investment-analyst">Investment Analyst</SelectItem>
                        <SelectItem value="property-manager">Property Manager</SelectItem>
                        <SelectItem value="business-development">Business Development</SelectItem>
                        <SelectItem value="finance-manager">Finance Manager</SelectItem>
                        <SelectItem value="hr-specialist">HR Specialist</SelectItem>
                        <SelectItem value="marketing-specialist">Marketing Specialist</SelectItem>
                        <SelectItem value="operations-manager">Operations Manager</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                    <Select onValueChange={(value) => handleInputChange('yearsOfExperience', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-3">2-3 years</SelectItem>
                        <SelectItem value="4-5">4-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currentLastPosition">Current/Last Position *</Label>
                    <Input
                      id="currentLastPosition"
                      type="text"
                      required
                      value={formData.currentLastPosition}
                      onChange={(e) => handleInputChange('currentLastPosition', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedSalary">Expected Salary (EGP) *</Label>
                    <Input
                      id="expectedSalary"
                      type="number"
                      required
                      value={formData.expectedSalary}
                      onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., 15000"
                    />
                  </div>
                </div>
              </div>

              {/* Skills & Qualifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Skills & Qualifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="highestEducationLevel">Highest Education Level *</Label>
                    <Select onValueChange={(value) => handleInputChange('highestEducationLevel', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="languageProficiency">Language Proficiency *</Label>
                    <Input
                      id="languageProficiency"
                      type="text"
                      required
                      value={formData.languageProficiency}
                      onChange={(e) => handleInputChange('languageProficiency', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., Arabic (Native), English (Fluent)"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="keySkills">Key Skills (comma-separated) *</Label>
                    <Textarea
                      id="keySkills"
                      required
                      value={formData.keySkills}
                      onChange={(e) => handleInputChange('keySkills', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., Financial Analysis, Project Management, Communication, Excel, PowerPoint"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Document Uploads
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="introVideoLink">Introduction Video Link (3 minutes max) - Optional</Label>
                    <Input
                      id="introVideoLink"
                      type="url"
                      value={formData.introVideoLink}
                      onChange={(e) => handleInputChange('introVideoLink', e.target.value)}
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
                        onChange={(file) => handleFileChange('cvFile', file)}
                        label="Upload CV"
                        description="PDF format only"
                        maxSize="5MB"
                        value={formData.cvFile}
                      />
                    </div>
                    <div>
                      <FileUpload
                        id="profilePicture"
                        accept="image/*"
                        required
                        onChange={(file) => handleFileChange('profilePicture', file)}
                        label="Profile Picture"
                        description="Image format only"
                        maxSize="2MB"
                        value={formData.profilePicture}
                      />
                    </div>
                  </div>
                  <div>
                    <FileUpload
                      id="certificationsFile"
                      accept=".pdf,image/*"
                      multiple
                      onChange={(files) => handleFileChange('certificationsFile', files)}
                      label="Certifications (Optional)"
                      description="PDF or Image formats"
                      maxSize="10MB total"
                      value={formData.certificationsFile}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="noticePeriod">Notice Period (if currently employed)</Label>
                    <Select onValueChange={(value) => handleInputChange('noticePeriod', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select notice period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="1-week">1 Week</SelectItem>
                        <SelectItem value="2-weeks">2 Weeks</SelectItem>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="2-months">2 Months</SelectItem>
                        <SelectItem value="3-months">3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="whyJoinCPI">Why do you want to join Crystal Power Investments? *</Label>
                    <Textarea
                      id="whyJoinCPI"
                      required
                      value={formData.whyJoinCPI}
                      onChange={(e) => handleInputChange('whyJoinCPI', e.target.value)}
                      className="mt-1"
                      placeholder="Tell us what motivates you to join our team and how you can contribute to our success..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold"
                >
                  Submit Application
                  <Upload className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Careers

