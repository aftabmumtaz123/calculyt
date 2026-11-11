export type CalculatorArticle = {
  intro: string;
  method: string;
  formula: string;
  example: string;
  tips: string[];
  limitations: string;
  faqs: { question: string; answer: string }[];
};
export const calculatorArticles: Record<string, CalculatorArticle> = {
  "compound-interest": {
    intro:
      "Compound interest means earning interest on both the original deposit and interest accumulated in earlier periods. Regular contributions can also earn returns after they are added, so time, rate and contribution timing all affect the projection.",
    method:
      "The calculator applies the selected annual rate over each compounding period and adds the regular contribution. It repeats that process for the full term, then compares the ending balance with the amount deposited.",
    formula:
      "A = P(1 + r/n)^(nt) for a single deposit. With periodic contributions, each contribution is grown for the remaining periods; this calculator models those additions period by period.",
    example:
      "Enter an initial deposit, annual rate, number of years and recurring contribution. The projected balance is then compared with total contributions to estimate the growth portion.",
    tips: [
      "Compare different time horizons while keeping the rate unchanged.",
      "Try a higher contribution to see how regular saving changes the projection.",
      "Treat the annual return as an assumption, not a guaranteed outcome.",
    ],
    limitations:
      "Assumes a constant return and regular contributions. Taxes, fees, inflation, volatility and changes in contributions are excluded.",
    faqs: [
      {
        question: "What is compound interest?",
        answer:
          "Interest is calculated on the principal plus interest accumulated in earlier periods.",
      },
      {
        question: "Does compounding frequency matter?",
        answer:
          "Yes. More frequent compounding generally produces a slightly higher effective return at the same nominal rate.",
      },
      {
        question: "Are the returns guaranteed?",
        answer:
          "No. The output is a mathematical projection based on the assumptions entered.",
      },
    ],
  },
  mortgage: {
    intro:
      "A mortgage is a loan used to finance a property purchase. The payment on a fixed-rate mortgage depends mainly on the amount borrowed, annual interest rate and repayment term.",
    method:
      "The down payment is subtracted from the property price to estimate the loan principal. The standard amortizing-loan formula is then used to calculate a level monthly principal-and-interest payment.",
    formula:
      "M = P × i × (1 + i)^n / ((1 + i)^n − 1), where P is principal, i is the monthly rate and n is the number of monthly payments. At 0% interest, M = P/n.",
    example:
      "Enter the property price, down payment, annual rate and term. For example, a 350,000 property with a 70,000 down payment starts with a 280,000 loan before fees.",
    tips: [
      "Compare a larger down payment with the original scenario.",
      "Compare shorter and longer loan terms.",
      "Budget separately for taxes, insurance, closing costs and maintenance.",
    ],
    limitations:
      "Estimates principal and interest only. Property tax, insurance, mortgage insurance, lender fees, variable rates and extra payments are excluded.",
    faqs: [
      {
        question: "Does this include property tax and insurance?",
        answer: "No. The displayed payment is principal and interest only.",
      },
      {
        question: "Why does a longer term usually cost more?",
        answer:
          "Interest accrues over more payment periods, even though the monthly payment may be lower.",
      },
      {
        question: "Is this a lender quote?",
        answer:
          "No. It is an educational estimate, not a loan offer or approval.",
      },
    ],
  },
  loan: {
    intro:
      "An installment loan is repaid through scheduled payments that cover interest and reduce principal. Estimating the monthly payment and total interest can help compare borrowing options.",
    method:
      "The calculator converts the annual nominal rate to a monthly rate and applies the standard fixed-payment amortization equation over the selected number of months.",
    formula:
      "Payment = P × i / (1 − (1 + i)^−n), where P is the amount borrowed, i is the monthly interest rate and n is the total monthly payments. At 0%, payment = P/n.",
    example:
      "Enter the amount borrowed, annual interest rate and repayment term. The result reports the estimated monthly installment, total repayment and total interest.",
    tips: [
      "Compare offers using the same amount and term.",
      "Check whether the advertised rate includes fees.",
      "Review early repayment and origination charges in the lender's terms.",
    ],
    limitations:
      "Assumes a fixed rate, equal monthly payments and no fees, penalties, missed payments or extra repayments.",
    faqs: [
      {
        question: "What is included in the payment?",
        answer:
          "Principal and interest are included; fees and insurance are not.",
      },
      {
        question: "What if the rate is zero?",
        answer: "The principal is divided evenly over the payment count.",
      },
      {
        question: "Can it predict a variable-rate loan?",
        answer: "No. It models one constant rate assumption.",
      },
    ],
  },
  savings: {
    intro:
      "A savings projection estimates how an opening balance and recurring deposits may accumulate. It helps illustrate the effect of deposit size, interest and time.",
    method:
      "Each month, the calculator applies the monthly interest rate to the current balance and then adds the monthly deposit. The chart tracks the projected balance across the saving period.",
    formula:
      "Monthly rate = annual rate / 12. Each period: new balance = previous balance × (1 + monthly rate) + monthly deposit.",
    example:
      "Enter a starting balance, monthly deposit, annual interest rate and saving period. Compare the final balance with the total amount you deposited.",
    tips: [
      "Try a slightly higher monthly deposit.",
      "Compare short and long time horizons.",
      "Keep emergency savings separate from longer-term goals.",
    ],
    limitations:
      "Assumes end-of-month deposits and a constant interest rate. Taxes, account fees, withdrawals and inflation are excluded.",
    faqs: [
      {
        question: "When are deposits added?",
        answer:
          "This implementation adds each deposit after that month's interest is applied.",
      },
      {
        question: "Does it adjust for inflation?",
        answer: "No. The result is a nominal balance.",
      },
      {
        question: "Can the rate change?",
        answer: "The model uses one constant rate throughout.",
      },
    ],
  },
  bmi: {
    intro:
      "Body mass index (BMI) compares a person's weight with height. It is a widely used screening measure, but it does not directly measure body fat or diagnose a health condition.",
    method:
      "The calculator converts height from centimeters to meters, squares it and divides weight in kilograms by that value. It then displays a broad adult classification band.",
    formula: "BMI = weight in kilograms / (height in meters)².",
    example:
      "For a person weighing 70 kg and measuring 1.75 m, BMI = 70 / (1.75 × 1.75), or approximately 22.9.",
    tips: [
      "Use kilograms and centimeters as requested by the fields.",
      "Interpret BMI alongside other health information.",
      "Children, teens, pregnancy and athletes may require different interpretation.",
    ],
    limitations:
      "BMI does not distinguish muscle from fat or account for every age, ancestry or health factor. It is a screening measure, not a diagnosis.",
    faqs: [
      {
        question: "Is BMI a diagnosis?",
        answer:
          "No. It should not be used alone to assess an individual's health.",
      },
      {
        question: "Can BMI mislead for muscular people?",
        answer:
          "Yes. Higher muscle mass can increase BMI without indicating higher body fat.",
      },
      {
        question: "Are adult categories suitable for children?",
        answer:
          "No. Children and teens require age- and sex-specific interpretation.",
      },
    ],
  },
  bmr: {
    intro:
      "Basal metabolic rate (BMR) estimates the energy the body uses at rest to support essential functions. It differs from total daily energy expenditure, which also includes movement and digestion.",
    method:
      "This calculator uses the Mifflin–St Jeor equation with weight, height, age and the selected equation setting to estimate resting energy needs.",
    formula:
      "Male equation: BMR = 10W + 6.25H − 5A + 5. Female equation: BMR = 10W + 6.25H − 5A − 161. W is kg, H is cm and A is years.",
    example:
      "Enter weight in kilograms, height in centimeters and age in years. The output is an estimated number of kilocalories used per day at rest.",
    tips: [
      "Check measurement units before calculating.",
      "Use an activity-adjusted estimate for total daily energy needs.",
      "Reassess when body weight or circumstances change.",
    ],
    limitations:
      "Equation estimates can differ from measured energy expenditure. This result is not a medical assessment or diet prescription.",
    faqs: [
      {
        question: "Is BMR the same as maintenance calories?",
        answer:
          "No. Maintenance estimates usually include activity and are higher than resting BMR.",
      },
      {
        question: "How accurate is the equation?",
        answer: "It is a population-based estimate; individual results vary.",
      },
      {
        question: "What does the equation setting change?",
        answer:
          "It selects one of the two constants in the Mifflin–St Jeor equation.",
      },
    ],
  },
  calorie: {
    intro:
      "A daily calorie estimate combines resting energy needs with an activity multiplier. It can provide a starting point for nutrition planning, but it is not a precise measurement.",
    method:
      "The calculator first estimates BMR using Mifflin–St Jeor, then multiplies it by the selected activity factor to estimate total daily energy expenditure.",
    formula: "Estimated daily calories = BMR × activity factor.",
    example:
      "Enter your measurements and select the activity level that best represents a typical week. The maintenance estimate approximates the intake associated with stable weight under those assumptions.",
    tips: [
      "Choose activity based on your typical routine, not one unusual workout.",
      "Treat small calorie differences as estimates.",
      "Seek qualified guidance for medical conditions or major dietary changes.",
    ],
    limitations:
      "The activity multiplier is broad and cannot account for every medical, metabolic, medication or lifestyle factor. It is not a diet prescription.",
    faqs: [
      {
        question: "What are maintenance calories?",
        answer:
          "An estimate of energy intake associated with maintaining weight under the selected activity assumption.",
      },
      {
        question: "Does exercise affect the result?",
        answer:
          "The activity factor summarizes typical exercise and everyday movement.",
      },
      {
        question: "Should I follow it exactly?",
        answer:
          "No. It is a starting estimate, not individualized clinical advice.",
      },
    ],
  },
  "ideal-weight": {
    intro:
      "Height-based ideal-weight equations provide rough reference estimates developed for population or clinical contexts. They are not universal targets for every body type.",
    method:
      "This calculator uses the Devine equation, beginning with a reference weight at five feet and adjusting by 2.3 kg for each inch above that height.",
    formula:
      "Male: 50 kg + 2.3 kg × inches above 5 ft. Female: 45.5 kg + 2.3 kg × inches above 5 ft.",
    example:
      "Enter height in centimeters and select the equation setting. The result is one formula-based reference estimate, not a recommended range.",
    tips: [
      "Treat the result as historical context rather than a personal goal.",
      "Consider body composition and health history.",
      "Use qualified advice for individual health decisions.",
    ],
    limitations:
      "The Devine formula does not account for muscle mass, body frame, age, ancestry, pregnancy or individual medical circumstances.",
    faqs: [
      {
        question: "Which formula is used?",
        answer:
          "The calculator uses the Devine height-based ideal body weight equation.",
      },
      {
        question: "Is this a health recommendation?",
        answer: "No. It is a rough formula-based reference.",
      },
      {
        question: "Why do other calculators differ?",
        answer: "They may use different historical equations and assumptions.",
      },
    ],
  },
  percentage: {
    intro:
      "A percentage expresses a value as a fraction of 100. Percentages are used for proportions, discounts, rates and comparisons.",
    method:
      "The calculator divides the entered part by the entered whole and multiplies by 100. If the whole is zero, this implementation returns zero to avoid division by zero.",
    formula: "Percentage = (part / whole) × 100.",
    example:
      "If 25 is the part and 200 is the whole, (25 / 200) × 100 = 12.5%.",
    tips: [
      "Use the correct total as the denominator.",
      "For percentage change, use the original value as the baseline.",
      "A result can exceed 100% if the part is greater than the whole.",
    ],
    limitations:
      "This tool calculates what percentage one value is of another. It is not a dedicated percentage-change or reverse-percentage calculator.",
    faqs: [
      {
        question: "How do I find a percentage?",
        answer: "Divide the part by the whole and multiply by 100.",
      },
      {
        question: "Can the result exceed 100%?",
        answer: "Yes, when the part is greater than the whole.",
      },
      {
        question: "What if the whole is zero?",
        answer:
          "This implementation returns zero to avoid an undefined division.",
      },
    ],
  },
  age: {
    intro:
      "An age calculator finds the calendar interval between a date of birth and a comparison date. Calendar age accounts for different month lengths and leap years rather than simply dividing days by 365.",
    method:
      "The calculator compares year, month and day components, borrowing days from the previous month and months from the previous year when needed. It also reports total elapsed days.",
    formula:
      "Calendar age = completed years, remaining completed months and remaining days between the selected dates.",
    example:
      "Choose a date of birth and an age-on date. The calculator reports completed years, months and days as of that comparison date.",
    tips: [
      "The comparison date can be in the past or future, but not before birth.",
      "Check the date format and selected dates carefully.",
      "Confirm local legal age-counting rules for official use.",
    ],
    limitations:
      "Different cultures and legal systems may define age differently. Month-end dates can also use different conventions; this calculator uses calendar borrowing.",
    faqs: [
      {
        question: "Can I calculate age on a past date?",
        answer:
          "Yes, provided the comparison date is on or after the birth date.",
      },
      {
        question: "Why can month and day results differ?",
        answer:
          "Months have different lengths and calculators may use different end-of-month conventions.",
      },
      {
        question: "Does it show seconds?",
        answer:
          "This implementation reports calendar years, months, days and total days.",
      },
    ],
  },
  "date-difference": {
    intro:
      "A date difference calculator measures elapsed calendar days between two selected dates. It is useful for timelines, planning and countdown calculations.",
    method:
      "The calculator converts both dates to local midnight and divides the elapsed milliseconds by the number of milliseconds in a day.",
    formula:
      "Elapsed days = (end date − start date) / 86,400,000 milliseconds.",
    example:
      "Choose a start date and end date. The result displays elapsed days and equivalent weeks, hours and minutes.",
    tips: [
      "Decide whether your use case counts both endpoints inclusively.",
      "Use correct local dates when working across time zones.",
      "Business-day calculations need weekend and holiday rules.",
    ],
    limitations:
      "This tool reports elapsed calendar days and does not add an inclusive extra day. It does not exclude weekends or public holidays.",
    faqs: [
      {
        question: "Is the end date included?",
        answer:
          "The result is elapsed difference and does not add an extra day for inclusive counting.",
      },
      {
        question: "Does it count working days?",
        answer: "No, it counts all calendar days.",
      },
      {
        question: "Can the end date be earlier?",
        answer: "No, the end date must be on or after the start date.",
      },
    ],
  },
  gpa: {
    intro:
      "A grade point average (GPA) summarizes course performance. A weighted GPA gives courses with more credit hours a proportionally larger influence.",
    method:
      "For each course, credit hours are multiplied by grade points. The quality points are added and divided by the total credit hours.",
    formula: "Weighted GPA = Σ(credit hours × grade points) / Σ(credit hours).",
    example:
      "If two courses each carry three credits and have grade points 4.0 and 3.0, GPA = (3×4 + 3×3) / 6 = 3.5.",
    tips: [
      "Enter grade points rather than letter grades in this version.",
      "Use the grading scale adopted by your institution.",
      "Include every course for a complete term average.",
    ],
    limitations:
      "This starter version accepts three courses and assumes one shared grade-point scale. Repeats, withdrawals and pass/fail policies are not modeled.",
    faqs: [
      {
        question: "Why do credit hours matter?",
        answer: "They weight each course according to its credit value.",
      },
      {
        question: "Does every institution use a 4.0 scale?",
        answer: "No. Grading scales and rules vary.",
      },
      {
        question: "Can it calculate cumulative GPA?",
        answer:
          "It calculates the weighted average of the three entered courses.",
      },
    ],
  },
  tip: {
    intro:
      "A tip calculator estimates gratuity and can split a bill evenly among a group. It is useful when checking a restaurant bill or deciding each person's share.",
    method:
      "The calculator multiplies the bill by the tip percentage, adds the tip to the bill and divides the total by the number of people.",
    formula:
      "Tip = bill × tip percentage / 100. Total per person = (bill + tip) / number of people.",
    example:
      "For a bill of 85 and a 15% tip shared by two people, the tip is 12.75 and the total is 97.75, or 48.875 per person.",
    tips: [
      "Decide whether tax should be included in the tip base.",
      "Enter the bill amount consistently.",
      "Round each share according to the payment method.",
    ],
    limitations:
      "The calculator splits the total evenly and does not support different orders, service charges, tax allocation or custom rounding.",
    faqs: [
      {
        question: "Does the tip apply before tax?",
        answer:
          "It applies to the bill amount entered; include tax in that amount if desired.",
      },
      {
        question: "Can it split unevenly?",
        answer: "No, this version divides the total equally.",
      },
      {
        question: "Does it round to cents?",
        answer:
          "Displayed values are formatted for readability; fractional minor units may remain in the calculation.",
      },
    ],
  },
  "fuel-cost": {
    intro:
      "A journey fuel-cost estimate combines distance, vehicle efficiency and fuel price. It can help compare route costs or prepare a travel budget.",
    method:
      "The calculator divides distance by fuel efficiency to estimate fuel required, then multiplies fuel required by the entered price per unit.",
    formula:
      "Fuel required = distance / fuel efficiency. Estimated cost = fuel required × price per unit.",
    example:
      "For a 350 km journey at 12 km/L, estimated fuel use is about 29.17 liters. Multiply that by the fuel price per liter for the estimated cost.",
    tips: [
      "Use matching units such as km and km/L.",
      "Choose a realistic average based on traffic and road conditions.",
      "Enter the round-trip distance if estimating a return journey.",
    ],
    limitations:
      "Actual consumption changes with driving style, traffic, terrain, weather, vehicle condition and load. Tolls, parking and maintenance are excluded.",
    faqs: [
      {
        question: "Can I use miles per gallon?",
        answer: "This version expects kilometers and kilometers per liter.",
      },
      {
        question: "Does it include a return trip?",
        answer: "Only when the total round-trip distance is entered.",
      },
      {
        question: "Why might actual cost differ?",
        answer: "Fuel prices and real-world efficiency can vary.",
      },
    ],
  },
  "random-number": {
    intro:
      "A random number generator selects one or more integers from a specified inclusive range. It can support simple games, classroom activities and casual sampling.",
    method:
      "The calculator rounds the minimum upward and maximum downward, then uses the browser's Math.random() function to select each integer.",
    formula: "Each draw = floor(random × (maximum − minimum + 1)) + minimum.",
    example:
      "Set the minimum to 1, maximum to 100 and count to 5 to generate five integers from 1 through 100.",
    tips: [
      "Check that the maximum is not smaller than the minimum.",
      "Use a count no greater than 100.",
      "Use a seeded generator when reproducibility is required.",
    ],
    limitations:
      "Math.random() is not cryptographically secure. Do not use this tool for passwords, security tokens, lotteries or regulated gambling.",
    faqs: [
      {
        question: "Are both endpoints included?",
        answer: "Yes, the minimum and maximum are both possible outcomes.",
      },
      {
        question: "Can I generate multiple values?",
        answer: "Yes, up to 100 values per request.",
      },
      {
        question: "Is this secure for passwords?",
        answer:
          "No. Security-sensitive values require a cryptographically secure random source.",
      },
    ],
  },
  "unit-conversion": {
    intro:
      "A length converter changes a measurement from one unit to another while preserving the same physical distance. This version supports common metric and imperial length units.",
    method:
      "Each supported unit is represented by its equivalent length in meters. The input is converted to meters and then divided by the target unit's meter factor.",
    formula:
      "Converted value = input × source-unit factor / target-unit factor, with each factor expressed in meters.",
    example:
      "To convert 10 meters to feet, multiply 10 by the number of feet in one meter. The calculator displays the result in the selected target unit.",
    tips: [
      "Choose units that match the original measurement.",
      "Keep enough decimal places for technical work.",
      "Check whether a source uses standard or specialized survey units.",
    ],
    limitations:
      "This version converts length only. It does not convert area, volume, mass, temperature or speed.",
    faqs: [
      {
        question: "Which units are supported?",
        answer: "Meters, kilometers, centimeters, feet, inches and miles.",
      },
      {
        question: "Why are results rounded?",
        answer: "The display limits decimal places for readability.",
      },
      {
        question: "Can it convert square meters to square feet?",
        answer:
          "No. Area conversion requires squared conversion factors and is not part of this length converter.",
      },
    ],
  },
};
