import { useState, useEffect } from "react";
import { convertCurrency, formatCurrency } from "../utils/currency";
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
import LZString from "lz-string";
import {
  Calculator,
  DollarSign,
  Home,
  Percent,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  Settings,
  Calendar,
  BarChart3,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ROICalculator = () => {
  const [formData, setFormData] = useState({
    country: "EGP",
    propertyPrice: "",
    downPayment: "20",
    mortgageTerm: "15",
    interestRate: "",
    rentalIncome: "",
    vacancyRate: "",
    maintenanceCosts: "5",
    managementFees: "0",
    transactionCosts: "",
    appreciationRate: "5",
    incomeTaxRate: "",
    propertyInsurance: "",
    propertyTaxRate: "",
    hoaFees: "0",
    capitalExpenditures: "1",
    inflationRate: "3",
    rentGrowthRate: "3",
    analysisYears: "5",
    entityType: "individual", // or "corporate"
    exitStrategy: "hold", // or "sell"
    sellYear: "5",
  });
  const [results, setResults] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [exchangeRates, setExchangeRates] = useState(null);

  // Add currency selector UI
  const CurrencySelector = () => (
    <select
      value={selectedCurrency}
      onChange={(e) => setSelectedCurrency(e.target.value)}
      className="currency-selector"
    >
      {exchangeRates &&
        Object.keys(exchangeRates).map((currency) => (
          <option key={currency} value={currency}>
            {currency} ({exchangeRates[currency].symbol})
          </option>
        ))}
    </select>
  );

  // Convert all displayed values
  const convertDisplayValue = (value) => {
    if (!exchangeRates || !results) return value;
    return convertCurrency(
      parseFloat(value),
      results.baseCurrency,
      selectedCurrency,
      exchangeRates
    );
  };

  // After receiving results from API
  useEffect(() => {
    if (results?.exchangeRates) {
      setExchangeRates(results.exchangeRates);
      setSelectedCurrency(results.baseCurrency);
    }
  }, [results]);

  const handleInputChange = (field, value) => {
    // Allow empty string or valid numbers
    if (value === "" || !isNaN(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const saveToURL = (results) => {
    const compressedData = LZString.compressToEncodedURIComponent(
      JSON.stringify({ formData, results })
    );
    window.history.pushState({}, "", `?results=${compressedData}`);
  };

  const loadFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const compressedData = params.get("results");
    if (compressedData) {
      try {
        return JSON.parse(
          LZString.decompressFromEncodedURIComponent(compressedData)
        );
      } catch (e) {
        console.error("Failed to parse URL data", e);
      }
    }
    return null;
  };

  const saveToLocalStorage = (data) => {
    localStorage.setItem(
      "roiCalculator",
      JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      })
    );
  };

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem("roiCalculator");
    return data ? JSON.parse(data) : null;
  };

  // Load saved data on mount
  useEffect(() => {
    const urlData = loadFromURL();
    if (urlData) {
      setFormData(urlData.formData);
      setResults(urlData.results);
      setIsCalculated(true);
      return;
    }

    const localData = loadFromLocalStorage();
    if (localData) {
      setFormData(localData.formData);
      setResults(localData.results);
      setIsCalculated(true);
    }
  }, []);

  const handleCountryChange = (value) => {
    const selectedCountry = countryOptions.find((c) => c.value === value);
    setFormData((prev) => ({
      ...prev,
      country: value,
      interestRate: selectedCountry.defaults.interestRate.toString(),
      vacancyRate: selectedCountry.defaults.vacancyRate.toString(),
      incomeTaxRate: selectedCountry.defaults.incomeTaxRate.toString(),
      transactionCosts: selectedCountry.defaults.transactionCosts.toString(),
    }));
  };

  const calculateROI = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://cpi-landing-webpage-backend-production.up.railway.app/api/tools/calculateRoi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            propertyPrice: parseFloat(formData.propertyPrice),
            rentalIncome: parseFloat(formData.rentalIncome),
            downPayment: parseFloat(formData.downPayment),
            mortgageTerm: parseFloat(formData.mortgageTerm),
            interestRate: parseFloat(formData.interestRate),
            vacancyRate: parseFloat(formData.vacancyRate),
            maintenanceCosts: parseFloat(formData.maintenanceCosts),
            managementFees: parseFloat(formData.managementFees),
            transactionCosts: parseFloat(formData.transactionCosts),
            appreciationRate: parseFloat(formData.appreciationRate),
            incomeTaxRate: parseFloat(formData.incomeTaxRate),
            propertyInsurance: parseFloat(formData.propertyInsurance),
            propertyTaxRate: parseFloat(formData.propertyTaxRate),
            hoaFees: parseFloat(formData.hoaFees),
            capitalExpenditures: parseFloat(formData.capitalExpenditures),
            inflationRate: parseFloat(formData.inflationRate),
            rentGrowthRate: parseFloat(formData.rentGrowthRate),
            analysisYears: parseInt(formData.analysisYears),
            sellYear: parseInt(formData.sellYear),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Calculation failed");
      }

      const data = await response.json();
      setResults(data);
      setIsCalculated(true);
      const saveData = { formData, results };
      saveToURL(results);
      saveToLocalStorage(saveData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCalculator = () => {
    setFormData({
      country: "EGP",
      propertyPrice: "",
      downPayment: "20",
      mortgageTerm: "15",
      interestRate: "8",
      rentalIncome: "",
      maintenanceCosts: "5",
      managementFees: "0",
      appreciationRate: "5",
      propertyInsurance: "",
      propertyTaxRate: "",
      hoaFees: "0",
      capitalExpenditures: "1",
      analysisYears: "5",
      entityType: "individual",
      exitStrategy: "hold",
      sellYear: "5",
      vacancyRate: "",
      incomeTaxRate: "",
      transactionCosts: "",
    });
    setResults(null);
    setIsCalculated(false);
    window.history.replaceState({}, "", window.location.pathname);
    localStorage.removeItem("roiCalculator");
  };

  const countryOptions = [
    {
      value: "EGP",
      label: "Egypt (EGP)",
      defaults: {
        interestRate: 8,
        vacancyRate: 7,
        incomeTaxRate: 10,
        transactionCosts: 5,
      },
    },
    {
      value: "AED",
      label: "UAE (AED)",
      defaults: {
        interestRate: 4.5,
        vacancyRate: 5,
        incomeTaxRate: 0,
        transactionCosts: 4,
      },
    },
    {
      value: "SAR",
      label: "KSA (SAR)",
      defaults: {
        interestRate: 5,
        vacancyRate: 6,
        incomeTaxRate: 0,
        transactionCosts: 4.5,
      },
    },
  ];

  const formatNumber = (value, isPercentage = false) => {
    if (isPercentage) {
      // For percentages, keep 2 decimal places
      return Number(value).toFixed(2);
    }
    // For currency values, add commas and remove decimal places
    return Number(value).toLocaleString("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
  };

  const DisclaimerAndCTA = () => (
    <div className="mt-8 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Disclaimer
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              This calculator is for educational purposes only. The results are
              based on the information provided and assumptions made. Actual
              investment performance may vary significantly. Please consult with
              financial advisors before making investment decisions.
            </p>
            <div className="bg-white rounded-lg p-6 border border-blue-100">
              <h5 className="text-md font-semibold text-gray-900 mb-3">
                Need Professional Guidance?
              </h5>
              <p className="text-sm text-gray-600 mb-4">
                Book a consultation with our CEO to discuss your investment
                strategy in detail.
              </p>
              <Button
                onClick={() =>
                  window.open("https://calendly.com/your-link", "_blank")
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InvestmentCharts = ({ results }) => {
    // Prepare data for charts
    const cashFlowData = results.yearlyAnalysis.map((year, index) => ({
      name: `Year ${index + 1}`,
      cashFlow: year.afterTaxCashFlow,
      noi: year.netOperatingIncome,
    }));

    const equityGrowthData = results.yearlyAnalysis.map((year, index) => ({
      name: `Year ${index + 1}`,
      equity: year.totalEquity,
      propertyValue: year.propertyValue,
    }));

    const expenseBreakdown = [
      {
        name: "Property Taxes",
        value:
          parseFloat(
            results.yearlyAnalysis[0].operatingExpenses.propertyTaxes
          ) / 1000,
      },
      {
        name: "Insurance",
        value:
          parseFloat(results.yearlyAnalysis[0].operatingExpenses.insurance) /
          1000,
      },
      {
        name: "Maintenance",
        value:
          parseFloat(results.yearlyAnalysis[0].operatingExpenses.maintenance) /
          1000,
      },
      {
        name: "Management",
        value:
          parseFloat(results.yearlyAnalysis[0].operatingExpenses.management) /
          1000,
      },
      {
        name: "HOA Fees",
        value:
          parseFloat(results.yearlyAnalysis[0].operatingExpenses.hoaFees) /
          1000,
      },
      {
        name: "CapEx",
        value:
          parseFloat(results.yearlyAnalysis[0].operatingExpenses.capEx) / 1000,
      },
    ].filter((item) => item.value > 0); // Only show positive values

    const COLORS = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#8884d8",
      "#82ca9d",
    ];

    return (
      <div className="mt-8 space-y-8">
        {/* Cash Flow Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Cash Flow Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="cashFlow"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.1}
                    name="Cash Flow"
                  />
                  <Area
                    type="monotone"
                    dataKey="noi"
                    stroke="#0EA5E9"
                    fill="#0EA5E9"
                    fillOpacity={0.1}
                    name="NOI"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Equity Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Equity & Property Value Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke="#059669"
                    fill="#059669"
                    fillOpacity={0.1}
                    name="Equity"
                  />
                  <Area
                    type="monotone"
                    dataKey="propertyValue"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.1}
                    name="Property Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Operating Expenses Breakdown (in thousands)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {expenseBreakdown.some((item) => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdown.filter((item) => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(1)}%)`
                        }
                        labelLine={{ stroke: "#666666", strokeWidth: 1 }}
                      >
                        {expenseBreakdown
                          .filter((item) => item.value > 0)
                          .map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="white"
                              strokeWidth={2}
                            />
                          ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${results.summary.currencySymbol} ${(
                            value * 1000
                          ).toLocaleString()}`,
                          "Annual Cost",
                        ]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{
                          paddingLeft: "20px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No expense data available to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isCalculated && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-t-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Investment Analysis
                </h2>
                <p className="mt-2 text-slate-300">
                  Detailed ROI calculation for your property investment
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <Calculator className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Currency Change Section */}
          <div>
            <div className="currency-controls">
              <CurrencySelector />
            </div>

            {/* Example converted display */}
            {results && exchangeRates && (
              <div className="result-item">
                <span>Property Value:</span>
                <span>
                  {formatCurrency(
                    convertDisplayValue(results.summary.totalInitialInvestment),
                    selectedCurrency,
                    exchangeRates
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Main Results Container */}
          <div className="bg-white shadow-xl rounded-b-2xl overflow-hidden">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gradient-to-r from-slate-50 to-white">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-2">
                      Total Investment
                    </h3>
                    <p className="text-3xl font-bold text-slate-900">
                      {results.summary.currencySymbol}{" "}
                      {formatNumber(results.summary.totalInitialInvestment)}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-medium">Down Payment:</span>{" "}
                  {formData.downPayment}% •
                  <span className="font-medium"> Fees:</span>{" "}
                  {results.assumptions.transactionCosts}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-2">
                      Cash-on-Cash ROI
                    </h3>
                    <p className="text-3xl font-bold text-emerald-600">
                      {formatNumber(results.summary.averageCashOnCashROI, true)}
                    </p>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-medium">Total Cash Flow:</span>{" "}
                  {results.summary.currencySymbol}{" "}
                  {formatNumber(results.summary.totalCashFlow)} •
                  <span className="font-medium"> IRR:</span>{" "}
                  {results.summary.irr}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-2">
                      Average Cap Rate
                    </h3>
                    <p className="text-3xl font-bold text-slate-900">
                      {formatNumber(results.summary.averageCapRate, true)}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Home className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-medium">Appreciation:</span>{" "}
                  {results.assumptions.appreciationRate} annually
                </div>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Income & Expenses */}
              <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                <div className="bg-slate-900 px-6 py-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Year {results.yearlyAnalysis.length} Summary
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-700">Gross Annual Rent</span>
                      <span className="font-semibold text-slate-900">
                        {results.summary.currencySymbol}{" "}
                        {formatNumber(
                          results.yearlyAnalysis[
                            results.yearlyAnalysis.length - 1
                          ].grossRentalIncome
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-700">
                        Vacancy ({results.assumptions.vacancyRate})
                      </span>
                      <span className="text-red-600 font-medium">
                        -{results.summary.currencySymbol}{" "}
                        {formatNumber(
                          results.yearlyAnalysis[
                            results.yearlyAnalysis.length - 1
                          ].grossRentalIncome -
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].adjustedRentalIncome
                        )}
                      </span>
                    </div>

                    <div className="border-t border-slate-300 pt-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-700 font-medium">
                          Effective Rental Income
                        </span>
                        <span className="font-semibold text-slate-900">
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].adjustedRentalIncome
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-700">
                          Operating Expenses
                        </span>
                        <span className="text-red-600 font-medium">
                          -{results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].operatingExpenses.total
                          )}
                        </span>
                      </div>

                      <div className="bg-white rounded-xl p-4 mt-3 border border-slate-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">
                              Property Taxes
                            </span>
                            <span className="text-slate-700">
                              -{results.summary.currencySymbol}{" "}
                              {formatNumber(
                                results.yearlyAnalysis[
                                  results.yearlyAnalysis.length - 1
                                ].operatingExpenses.propertyTaxes
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Insurance</span>
                            <span className="text-slate-700">
                              -{results.summary.currencySymbol}{" "}
                              {formatNumber(
                                results.yearlyAnalysis[
                                  results.yearlyAnalysis.length - 1
                                ].operatingExpenses.insurance
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Maintenance</span>
                            <span className="text-slate-700">
                              -{results.summary.currencySymbol}{" "}
                              {formatNumber(
                                results.yearlyAnalysis[
                                  results.yearlyAnalysis.length - 1
                                ].operatingExpenses.maintenance
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">
                              Management Fees
                            </span>
                            <span className="text-slate-700">
                              -{results.summary.currencySymbol}{" "}
                              {formatNumber(
                                results.yearlyAnalysis[
                                  results.yearlyAnalysis.length - 1
                                ].operatingExpenses.management
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">HOA Fees</span>
                            <span className="text-slate-700">
                              -{results.summary.currencySymbol}{" "}
                              {formatNumber(
                                results.yearlyAnalysis[
                                  results.yearlyAnalysis.length - 1
                                ].operatingExpenses.hoaFees
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">
                              Capital Expenditures
                            </span>
                            <span className="text-slate-700">
                              -{results.summary.currencySymbol}{" "}
                              {formatNumber(
                                results.yearlyAnalysis[
                                  results.yearlyAnalysis.length - 1
                                ].operatingExpenses.capEx
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-300 pt-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-700 font-medium">
                          Net Operating Income
                        </span>
                        <span className="font-semibold text-slate-900">
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].netOperatingIncome
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-700">
                          Mortgage Payments
                        </span>
                        <span className="text-red-600 font-medium">
                          -{results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].mortgagePayment
                          )}
                        </span>
                      </div>

                      <div className="bg-white rounded-xl p-4 mt-3 border border-slate-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">
                              Principal Paid
                            </span>
                            <span className="text-emerald-700 font-medium">
                              {results.summary.currencySymbol}{" "}
                              {formatNumber(
                                results.yearlyAnalysis[
                                  results.yearlyAnalysis.length - 1
                                ].principalPaid
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">
                              Interest Paid
                            </span>
                            <span className="text-slate-700">
                              -{results.summary.currencySymbol}{" "}
                              {formatNumber(
                                results.yearlyAnalysis[
                                  results.yearlyAnalysis.length - 1
                                ].interestPaid
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-slate-900 pt-4 mt-6">
                      <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-900 text-lg">
                            After-Tax Cash Flow
                          </span>
                          <span
                            className={`font-bold text-xl ${
                              parseFloat(
                                results.yearlyAnalysis[
                                  results.yearlyAnalysis.length - 1
                                ].afterTaxCashFlow
                              ) >= 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {results.summary.currencySymbol}{" "}
                            {formatNumber(
                              results.yearlyAnalysis[
                                results.yearlyAnalysis.length - 1
                              ].afterTaxCashFlow
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI Analysis */}
              <div className="space-y-6">
                {/* Cap Rate */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-900 px-6 py-4">
                    <h4 className="font-semibold text-white">
                      Capitalization Rate
                    </h4>
                  </div>
                  <div className="p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-4xl font-bold text-slate-900">
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].capRate,
                            true
                          )}
                        </span>
                        <p className="text-sm text-slate-500 mt-2">
                          Net Operating Income ÷ Property Value
                        </p>
                      </div>
                      <div className="text-right text-sm text-slate-600">
                        <p className="font-medium">
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].netOperatingIncome
                          )}
                        </p>
                        <p className="text-slate-500">
                          ÷ {results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].propertyValue
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cash-on-Cash ROI */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-900 px-6 py-4">
                    <h4 className="font-semibold text-white">
                      Cash-on-Cash Return
                    </h4>
                  </div>
                  <div className="p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <span
                          className={`text-4xl font-bold ${
                            parseFloat(
                              results.yearlyAnalysis[
                                results.yearlyAnalysis.length - 1
                              ].cashOnCashROI
                            ) >= 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].cashOnCashROI,
                            true
                          )}
                        </span>
                        <p className="text-sm text-slate-500 mt-2">
                          After-Tax Cash Flow ÷ Total Investment
                        </p>
                      </div>
                      <div className="text-right text-sm text-slate-600">
                        <p className="font-medium">
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].afterTaxCashFlow
                          )}
                        </p>
                        <p className="text-slate-500">
                          ÷ {results.summary.currencySymbol}{" "}
                          {formatNumber(results.summary.totalInitialInvestment)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equity Build-up */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-900 px-6 py-4">
                    <h4 className="font-semibold text-white">Total Equity</h4>
                  </div>
                  <div className="p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-4xl font-bold text-slate-900">
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].totalEquity
                          )}
                        </span>
                        <p className="text-sm text-slate-500 mt-2">
                          Down Payment + Principal + Appreciation
                        </p>
                      </div>
                      <div className="text-right text-sm text-slate-600">
                        <p className="font-medium">
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(
                            (parseFloat(formData.downPayment) *
                              parseFloat(formData.propertyPrice)) /
                              100
                          )}
                        </p>
                        <p className="text-slate-500">
                          + {results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.yearlyAnalysis[
                              results.yearlyAnalysis.length - 1
                            ].principalPaid
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exit Analysis */}
                {results.exitAnalysis && (
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Exit Strategy Analysis
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-slate-300 mb-1">
                          Selling Price
                        </p>
                        <p className="font-semibold text-lg">
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(results.exitAnalysis.sellingPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">
                          Capital Gains Tax
                        </p>
                        <p className="font-semibold text-lg">
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(results.exitAnalysis.capitalGainsTax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">
                          Net Proceeds
                        </p>
                        <p className="font-semibold text-lg">
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(
                            results.exitAnalysis.netProceedsAfterTax
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">
                          Total Return
                        </p>
                        <p
                          className={`font-semibold text-lg ${
                            parseFloat(results.exitAnalysis.totalReturn) >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {results.summary.currencySymbol}{" "}
                          {formatNumber(results.exitAnalysis.totalReturn)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="p-8 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Analysis Assumptions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                      Vacancy Rate: {results.assumptions.vacancyRate}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                      Income Tax: {results.assumptions.incomeTaxRate}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                      Annual Appreciation:{" "}
                      {results.assumptions.appreciationRate}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                      Property Tax: {results.assumptions.propertyTaxRate}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                      Analysis Period: {formData.analysisYears} years
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <Button
                    onClick={resetCalculator}
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    Recalculate
                  </Button>
                  <Button className="bg-slate-700 text-white hover:bg-slate-800 px-6 py-3 rounded-xl font-medium transition-all duration-200">
                    Save Report
                  </Button>
                  <Button className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-xl font-medium transition-all duration-200">
                    Contact Advisor
                  </Button>
                </div>
              </div>
            </div>

            <InvestmentCharts results={results} />
            <DisclaimerAndCTA />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Advanced ROI Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Accurate property investment calculations for Egypt, UAE, and KSA
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Calculation Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 flex items-center">
              <Calculator className="w-6 h-6 mr-2" />
              Investment Parameters
            </CardTitle>
            <CardDescription>
              Fill in the details for accurate ROI calculation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculateROI} className="space-y-6">
              {/* Country Selection */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {countryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Price */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="propertyPrice">
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-2" />
                      Property Price ({formData.country})
                    </div>
                  </Label>
                  <Input
                    id="propertyPrice"
                    type="number"
                    required
                    value={formData.propertyPrice}
                    onChange={(e) =>
                      handleInputChange("propertyPrice", e.target.value)
                    }
                    className="mt-1"
                    placeholder="e.g., 5000000"
                    min="0"
                  />
                </div>
              </div>

              {/* Financial Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="downPayment">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 mr-2" />
                      Down Payment (%)
                    </div>
                  </Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={formData.downPayment}
                    onChange={(e) =>
                      handleInputChange("downPayment", e.target.value)
                    }
                    className="mt-1"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="transactionCosts">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 mr-2" />
                      Transaction Costs (%)
                    </div>
                  </Label>
                  <Input
                    id="transactionCosts"
                    type="number"
                    value={formData.transactionCosts}
                    onChange={(e) =>
                      handleInputChange("transactionCosts", e.target.value)
                    }
                    className="mt-1"
                    step="0.001"
                    min="0"
                  />
                </div>
              </div>

              {/* Mortgage Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mortgageTerm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Mortgage Term (years)
                    </div>
                  </Label>
                  <Input
                    id="mortgageTerm"
                    type="number"
                    value={formData.mortgageTerm}
                    onChange={(e) =>
                      handleInputChange("mortgageTerm", e.target.value)
                    }
                    className="mt-1"
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 mr-2" />
                      Interest Rate (%)
                    </div>
                  </Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={formData.interestRate}
                    onChange={(e) => {
                      let val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        handleInputChange("interestRate", val.toFixed(3));
                      }
                    }}
                    className="mt-1"
                    step="0.001"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Rental Income */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rentalIncome">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Monthly Rental Income ({formData.country})
                    </div>
                  </Label>
                  <Input
                    id="rentalIncome"
                    type="number"
                    required
                    value={formData.rentalIncome}
                    onChange={(e) =>
                      handleInputChange("rentalIncome", e.target.value)
                    }
                    className="mt-1"
                    placeholder="e.g., 10000"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="vacancyRate">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 mr-2" />
                      Vacancy Rate (%)
                    </div>
                  </Label>
                  <Input
                    id="vacancyRate"
                    type="number"
                    value={formData.vacancyRate}
                    onChange={(e) =>
                      handleInputChange("vacancyRate", e.target.value)
                    }
                    className="mt-1"
                    step="0.001"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Expenses */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maintenanceCosts">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 mr-2" />
                      Maintenance (%)
                    </div>
                  </Label>
                  <Input
                    id="maintenanceCosts"
                    type="number"
                    value={formData.maintenanceCosts}
                    onChange={(e) =>
                      handleInputChange("maintenanceCosts", e.target.value)
                    }
                    className="mt-1"
                    step="0.001"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="managementFees">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 mr-2" />
                      Management Fees (%)
                    </div>
                  </Label>
                  <Input
                    id="managementFees"
                    type="number"
                    value={formData.managementFees}
                    onChange={(e) =>
                      handleInputChange("managementFees", e.target.value)
                    }
                    className="mt-1"
                    step="0.001"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="incomeTaxRate">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 mr-2" />
                      Income Tax (%)
                    </div>
                  </Label>
                  <Input
                    id="incomeTaxRate"
                    type="number"
                    value={formData.incomeTaxRate}
                    onChange={(e) =>
                      handleInputChange("incomeTaxRate", e.target.value)
                    }
                    className="mt-1"
                    step="0.001"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Appreciation */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="appreciationRate">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Expected Annual Appreciation (%)
                    </div>
                  </Label>
                  <Input
                    id="appreciationRate"
                    type="number"
                    value={formData.appreciationRate}
                    onChange={(e) =>
                      handleInputChange("appreciationRate", e.target.value)
                    }
                    className="mt-1"
                    step="0.001"
                    min="0"
                  />
                </div>
              </div>

              {/* Additional Fields */}
              <div className="space-y-6 border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Additional Parameters
                </h3>

                {/* Property Insurance & Taxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="propertyInsurance">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Property Insurance (%)
                      </div>
                    </Label>
                    <Input
                      id="propertyInsurance"
                      type="number"
                      value={formData.propertyInsurance}
                      onChange={(e) =>
                        handleInputChange("propertyInsurance", e.target.value)
                      }
                      className="mt-1"
                      step="0.001"
                      min="0"
                      placeholder="e.g., 0.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyTaxRate">
                      <div className="flex items-center">
                        <Percent className="w-4 h-4 mr-2" />
                        Property Tax Rate (%)
                      </div>
                    </Label>
                    <Input
                      id="propertyTaxRate"
                      type="number"
                      value={formData.propertyTaxRate}
                      onChange={(e) =>
                        handleInputChange("propertyTaxRate", e.target.value)
                      }
                      className="mt-1"
                      step="0.001"
                      min="0"
                      placeholder="e.g., 1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hoaFees">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Monthly HOA Fees
                      </div>
                    </Label>
                    <Input
                      id="hoaFees"
                      type="number"
                      value={formData.hoaFees}
                      onChange={(e) =>
                        handleInputChange("hoaFees", e.target.value)
                      }
                      className="mt-1"
                      min="0"
                      placeholder="e.g., 200"
                    />
                  </div>
                </div>

                {/* Investment Strategy */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="capitalExpenditures">
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Capital Expenditures (%)
                      </div>
                    </Label>
                    <Input
                      id="capitalExpenditures"
                      type="number"
                      value={formData.capitalExpenditures}
                      onChange={(e) =>
                        handleInputChange("capitalExpenditures", e.target.value)
                      }
                      className="mt-1"
                      step="0.001"
                      min="0"
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="entityType">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Entity Type
                      </div>
                    </Label>
                    <select
                      id="entityType"
                      value={formData.entityType}
                      onChange={(e) =>
                        handleInputChange("entityType", e.target.value)
                      }
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="individual">Individual</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="exitStrategy">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Exit Strategy
                      </div>
                    </Label>
                    <select
                      id="exitStrategy"
                      value={formData.exitStrategy}
                      onChange={(e) =>
                        handleInputChange("exitStrategy", e.target.value)
                      }
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="hold">Hold</option>
                      <option value="sell">Sell</option>
                    </select>
                  </div>
                </div>

                {/* Analysis Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="analysisYears">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Analysis Period (Years)
                      </div>
                    </Label>
                    <Input
                      id="analysisYears"
                      type="number"
                      value={formData.analysisYears}
                      onChange={(e) =>
                        handleInputChange("analysisYears", e.target.value)
                      }
                      className="mt-1"
                      min="1"
                      max="30"
                      placeholder="e.g., 5"
                    />
                  </div>
                  {formData.exitStrategy === "sell" && (
                    <div>
                      <Label htmlFor="sellYear">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Planned Sale Year
                        </div>
                      </Label>
                      <Input
                        id="sellYear"
                        type="number"
                        value={formData.sellYear}
                        onChange={(e) =>
                          handleInputChange("sellYear", e.target.value)
                        }
                        className="mt-1"
                        min="1"
                        max={formData.analysisYears}
                        placeholder={`1-${formData.analysisYears}`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Calculating..." : "Calculate ROI"}
                <Calculator className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Display */}
        {isCalculated && results && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-500">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Investment Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Investment
                    </h3>
                    <p className="text-2xl font-bold">
                      {results.currency} {results.totalInvestment}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Monthly Mortgage
                    </h3>
                    <p className="text-2xl font-bold">
                      {results.currency} {results.monthlyPayment}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      5-Year Value
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {results.currency} {results.futureValue}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Annual Cash Flow
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Gross Rental Income
                    </h3>
                    <p className="text-xl">
                      {results.currency} {results.adjustedAnnualRent}
                      <span className="text-sm text-gray-500 ml-2">
                        ({results.assumptions.vacancyRate}% vacancy)
                      </span>
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Expenses
                    </h3>
                    <p className="text-xl text-red-600">
                      -{results.currency} {results.annualExpenses}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Net Income (After Tax)
                    </h3>
                    <p className="text-xl font-bold">
                      {results.currency} {results.netIncomeAfterTax}
                      <span className="text-sm text-gray-500 ml-2">
                        ({results.assumptions.incomeTaxRate}% tax)
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Return Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Cap Rate
                    </h3>
                    <p className="text-2xl font-bold">{results.capRate}%</p>
                    <p className="text-xs text-gray-500">
                      Net Operating Income ÷ Property Price
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Cash-on-Cash ROI
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {results.cashOnCashROI}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Net Income ÷ Total Investment
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total ROI
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {results.totalROI}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Cash ROI + Appreciation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Assumptions
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Transaction costs: {results.assumptions.transactionCosts}% of
                  property price
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Vacancy rate: {results.assumptions.vacancyRate}%
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Income tax: {results.assumptions.incomeTaxRate}%
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Annual appreciation: {formData.appreciationRate}%
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ROICalculator;
