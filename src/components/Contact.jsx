import { useState } from "react";
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
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Contact form submitted:", formData);
    setIsSubmitted(true);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Our Address",
      details: ["6 October, Dream Land Emeralds GT10 - Cairo, Egypt"],
      color: "bg-blue-500",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Numbers",
      details: ["+201066505665", "+201005288884"],
      color: "bg-green-500",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      details: ["info@crystalpowerinvestments.com"],
      color: "bg-purple-500",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: [
        "Sunday - Thursday: 9:00 AM - 6:00 PM",
        "Friday - Saturday: Closed",
      ],
      color: "bg-orange-500",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Message Sent Successfully!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for contacting Crystal Power Investments. We have
              received your message and will get back to you soon.
            </p>
            <p className="text-gray-600 mb-8">
              Our team typically responds within 24-48 hours during business
              days.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with Crystal Power Investments. We're here to answer
            your questions and discuss how we can help you achieve your
            investment goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Get In Touch
            </h2>

            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <div className="text-white">{info.icon}</div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Section - Made wider and centered */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-96 w-full">
                  {" "}
                  {/* Increased height and full width */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.8234567890123!2d31.0380922!3d29.9732775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145851007d55230b%3A0xeda3ac69eb1ee137!2sGTA9!5e0!3m2!1sen!2seg!4v1640995200000!5m2!1sen!2seg"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Crystal Power Investments Location"
                    className="mx-auto" // Center the map
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="mt-1"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="mt-1"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="mt-1"
                        placeholder="+20 xxx xxx xxxx"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        className="mt-1"
                        placeholder="What is this about?"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      className="mt-1"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold cursor-pointer" // Added cursor-pointer
                  >
                    Send Message
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Why Choose Crystal Power Investments?
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>
                      Expert investment strategies tailored to your needs
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>
                      Diversified portfolio across multiple business sectors
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Proven track record of successful investments</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Transparent communication and regular updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gray-900 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Start Your Investment Journey?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Contact us today to schedule a consultation and discover how
                Crystal Power Investments can help you achieve your financial
                goals through strategic property investment.
              </p>
              {!showPhoneNumber ? (
                <Button
                  onClick={() => setShowPhoneNumber(true)}
                  className="bg-white text-gray-900 hover:bg-gray-100 cursor-pointer" // Added cursor-pointer
                >
                  Schedule Consultation
                </Button>
              ) : (
                <div className="bg-white bg-opacity-10 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2 text-black">
                    {" "}
                    {/* Changed to black text */}
                    Call us to schedule your consultation:
                  </h3>
                  <div className="flex items-center justify-center space-x-2 text-2xl font-bold">
                    <Phone className="w-6 h-6" />
                    <a
                      href="tel:+201066505665"
                      className="hover:text-gray-300 transition-colors text-black" // Changed to black text
                    >
                      +201066505665
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
