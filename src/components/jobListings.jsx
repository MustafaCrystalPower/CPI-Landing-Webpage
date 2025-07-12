import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Search,
  Calendar,
  BarChart2,
  Layers,
  Award,
  Shield,
  Users,
  ArrowUpRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

// Job Detail Component (defined first)
const JobDetail = ({ job, onBack }) => {
  const formattedSalary = job.salaryRange?.isPublic
    ? `${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()} ${
        job.salaryRange.currency
      }`
    : "Salary information available upon application";

  const formattedLocation =
    job.locationType === "remote"
      ? "Remote"
      : `${job.location.city || ""}${
          job.location.city && job.location.country ? ", " : ""
        }${job.location.country || ""}`;

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 flex items-center gap-1"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to all positions
      </Button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-8 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {job.employmentType.replace("-", " ")}
                </Badge>

                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {formattedLocation}
                </Badge>

                <Badge variant="secondary" className="flex items-center gap-1">
                  <BarChart2 className="w-4 h-4" />
                  {job.experienceLevel} level
                </Badge>

                {job.salaryRange?.isPublic && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <DollarSign className="w-4 h-4" />
                    {formattedSalary}
                  </Badge>
                )}
              </div>

              <div className="flex items-center text-gray-600 gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                </div>

                {job.applicationDeadline && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      Apply by{" "}
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <Button
                onClick={() =>
                  document.getElementById("application-form")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="bg-gray-900 hover:bg-gray-800 w-full"
              >
                Apply Now <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>

              {job.applicationLink && (
                <Button
                  variant="outline"
                  onClick={() => window.open(job.applicationLink, "_blank")}
                  className="w-full"
                >
                  Apply via LinkedIn
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-700" />
                Job Description
              </h2>
              <p className="mb-6 text-gray-700">{job.description}</p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-700" />
                Key Responsibilities
              </h2>
              <ul className="mb-6 space-y-3">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-900">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-700" />
                Requirements
              </h2>
              <ul className="mb-6 space-y-3">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-900">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              {job.benefits?.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-700" />
                    Benefits & Perks
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {job.benefits.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="text-gray-900">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 space-y-6 sticky top-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Job Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Employment Type</p>
                      <p className="text-gray-900 capitalize">
                        {job.employmentType.replace("-", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BarChart2 className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Experience Level</p>
                      <p className="text-gray-900 capitalize">
                        {job.experienceLevel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">
                        {formattedLocation}
                        {job.locationType !== "remote" && (
                          <span className="text-gray-500 ml-1">
                            ({job.locationType})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="text-gray-900">{formattedSalary}</p>
                    </div>
                  </div>

                  {job.department && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-gray-900">{job.department}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {job.applicationDeadline && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Application Deadline
                  </h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    {new Date(job.applicationDeadline).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={() =>
                    document
                      .getElementById("application-form")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className="bg-gray-900 hover:bg-gray-800 w-full"
                >
                  Apply Now
                </Button>

                {job.applicationEmail && (
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Or email your application to:
                    <br />
                    <a
                      href={`mailto:${job.applicationEmail}`}
                      className="text-gray-900 hover:underline"
                    >
                      {job.applicationEmail}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className="py-12 text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
    <p className="mt-4 text-gray-600">Loading available positions...</p>
  </div>
);

// Error State Component
const ErrorState = ({ error }) => (
  <div className="py-12 text-center">
    <p className="text-red-500">Error loading job postings: {error}</p>
    <p className="text-gray-600 mt-2">
      Please try again later or contact our HR department.
    </p>
  </div>
);

// Job Card Component
const JobCard = ({ job, onClick }) => (
  <Card
    className="hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
    onClick={onClick}
  >
    <CardHeader>
      <CardTitle className="text-xl">{job.title}</CardTitle>
      <CardDescription className="flex flex-wrap gap-2 mt-2">
        <Badge variant="outline" className="flex items-center">
          <Briefcase className="w-4 h-4 mr-1" />
          {job.employmentType}
        </Badge>
        <Badge variant="outline" className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {job.locationType === "remote"
            ? "Remote"
            : `${job.location.city || ""}${
                job.location.city && job.location.country ? ", " : ""
              }${job.location.country || ""}`}
        </Badge>
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="line-clamp-3 text-gray-600 mb-4">
        {job.shortDescription || job.description.substring(0, 150) + "..."}
      </p>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          Posted {new Date(job.postedAt).toLocaleDateString()}
        </div>
        <Button variant="ghost" className="flex items-center">
          View Details <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center gap-2">
    <Button
      variant="outline"
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> Previous
    </Button>

    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      let pageNum;
      if (totalPages <= 5) {
        pageNum = i + 1;
      } else if (currentPage <= 3) {
        pageNum = i + 1;
      } else if (currentPage >= totalPages - 2) {
        pageNum = totalPages - 4 + i;
      } else {
        pageNum = currentPage - 2 + i;
      }

      return (
        <Button
          key={pageNum}
          variant={currentPage === pageNum ? "default" : "outline"}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      );
    })}

    {totalPages > 5 && currentPage < totalPages - 2 && (
      <span className="px-4 py-2">...</span>
    )}

    {totalPages > 5 && currentPage < totalPages - 2 && (
      <Button variant="outline" onClick={() => onPageChange(totalPages)}>
        {totalPages}
      </Button>
    )}

    <Button
      variant="outline"
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
    >
      Next <ChevronRight className="w-4 h-4 ml-1" />
    </Button>
  </div>
);

// Main Component
const JobPostingsSection = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await fetch(
          "https://cpi-landing-webpage-backend-production.up.railway.app/api/job-postings"
        );
        if (!response.ok) throw new Error("Failed to fetch job postings");
        const data = await response.json();
        setJobPostings(data);
        setFilteredJobs(data);
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  useEffect(() => {
    let results = jobPostings;

    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (employmentFilter !== "all") {
      results = results.filter(
        (job) => job.employmentType === employmentFilter
      );
    }

    if (locationFilter !== "all") {
      results = results.filter((job) => job.locationType === locationFilter);
    }

    if (experienceFilter !== "all") {
      results = results.filter(
        (job) => job.experienceLevel === experienceFilter
      );
    }

    setFilteredJobs(results);
    setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [
    jobPostings,
    searchTerm,
    employmentFilter,
    locationFilter,
    experienceFilter,
  ]);

  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (selectedJob)
    return <JobDetail job={selectedJob} onBack={() => setSelectedJob(null)} />;

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Current Open Positions
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {filteredJobs.length} positions available
        </p>
      </div>

      {/* Search and Filters - Always visible */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search positions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Select value={employmentFilter} onValueChange={setEmploymentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Employment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="on-site">On-site</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Section */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No positions match your current filters
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or select different filters
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default JobPostingsSection;
