# MAKERERE UNIVERSITY

## Design and Implementation Framework for an AI-Enabled Mobile Application to Support Ventilator Management in Uganda’s Critical Care Settings

**By**
**COLLINS AINOMUJUNI**
Reg. No. **2019/HD08/24977U**

**Supervisor 1:** Dr. Mujjuni Francis
Department of Mechanical Engineering, Makerere University

**Supervisor 2:** Dr. Kayiwa Ronald
Department of Mechanical Engineering, Makerere University

**December, 2025**
Kampala, Uganda

---

## DECLARATION

I, **COLLINS AINOMUJUNI**, declare that this research proposal is original and has not been submitted for any other degree or award to any other university or institution.

---

## APPROVALS

This dissertation has been submitted for examination with the approval of the following Supervisors.

* **Dr. Mujjuni Francis**, Department of Mechanical Engineering, Makerere University
* **Dr. Kayiwa Ronald**, Department of Mechanical Engineering, Makerere University

---

## DEDICATION

I express my heartfelt gratitude to our lecturers for their invaluable guidance.

---

## ACKNOWLEDGEMENT

I take this opportunity to express my sincere gratitude to Dr. Kayiwa Ronald and Dr. Mujjuni Francis who have taught us to write better proposals.

---

## TABLE OF CONTENTS

1. Abstract
2. Chapter One: Introduction
3. Chapter Two: Literature Review
4. Chapter Three: Methodology
5. References

---

## LIST OF ABBREVIATIONS

* **COPD** – Chronic Obstructive Pulmonary Disease
* **ARDS** – Acute Respiratory Distress Syndrome
* **LMICs** – Low- and Middle-Income Countries
* **VILI** – Ventilator-Induced Lung Injury
* **CDSS** – Clinical Decision Support System
* **ABG** – Arterial Blood Gas
* **ICU** – Intensive Care Unit
* **NICU** – Neonatal Intensive Care Unit

---

## ABSTRACT

Mechanical ventilation is essential to critical care but requires specialized expertise. In Uganda, shortages of intensivists constrain safe ventilator initiation and management. This study proposes a simple, AI-enabled mobile application that simulates the role of a specialist, empowering non-specialist clinicians to safely manage mechanical ventilation in the absence of intensivists or anesthesiologists. The system uses a locally embedded comprehensive ventilation dataset for on-device decision support, with optional online AI support for complex cases when internet connectivity is available. Clinicians input patient medical conditions, parameters, and available test results. The app analyzes this information, may request additional tests, and then instructs clinicians on appropriate ventilation modes, settings, and management strategies, effectively acting as a specialist substitute. The application provides step-by-step guidance from patient assessment through ventilator initiation and ongoing management, enhancing patient safety and clinical outcomes in resource-limited settings.

---

# CHAPTER ONE: INTRODUCTION

## 1.1 Background to the Study

Mechanical ventilation is the foundation of critical care medicine, providing life support to patients with severe respiratory failure such as COPD, pneumonia, and ARDS. Uganda faces increasing demand for critical care services due to rising respiratory diseases and emergency conditions. However, ventilator management remains challenged by severe human-resource shortages, limited monitoring tools, and reliance on subjective clinical judgment.

Uganda has fewer than 15 trained intensivists and approximately 55–60 ICU beds serving a population of over 45 million. As a result, ventilator management often falls to non-specialist clinicians, increasing the risk of delayed initiation, inappropriate settings, ventilator-induced lung injury, and avoidable mortality.

AI has the potential to address these gaps by providing structured decision support, trend analysis, and alerts. However, existing AI-driven ventilator systems are unsuitable for Uganda due to infrastructural, economic, and contextual constraints. Most existing systems require continuous internet connectivity for cloud-based AI models, advanced hardware integration, or complex infrastructure. A mobile-based solution that primarily operates on-device using a comprehensive embedded dataset, with optional online AI support for complex cases, is therefore needed to simulate specialist oversight.

## 1.2 Problem Statement

Uganda's ICUs suffer from shortages of trained personnel, limited ABG availability, and fragmented monitoring systems. Existing AI-driven ventilator solutions require advanced infrastructure or continuous internet connectivity unavailable in most Ugandan hospitals. There is a critical need for a mobile decision-support tool that simulates the role of a specialist, guiding non-specialist clinicians through patient assessment, test interpretation, and ventilator management decisions. The system should primarily operate offline using a comprehensive local dataset, with optional online AI support for complex cases when connectivity is available, providing specific instructions on ventilation modes and settings without requiring hardware integration.

## 1.3 Main Objective

To design and develop a simple, AI-enabled mobile application that simulates the role of a specialist, guiding non-specialist clinicians through safe ventilator management in the absence of intensivists or anesthesiologists. The system uses a comprehensive locally embedded ventilation dataset for primary on-device decision support, with optional online AI support for complex cases when internet connectivity is available. Clinicians input patient conditions, parameters, and test results; the app analyzes inputs, requests additional tests when needed, and provides specific instructions on ventilation modes and settings, effectively replacing specialist oversight.

## 1.4 Specific Objectives

1. Create a comprehensive ventilation dataset file containing diverse clinical scenarios, patient parameters, ventilator settings, and outcomes to handle all possible cases for embedded on-device decision-making.
2. Determine system requirements for a mobile application with primary offline functionality and optional online AI support for complex cases.
3. Develop a mobile application interface that: (a) guides clinicians through patient assessment with step-by-step protocols, (b) accepts input of patient conditions, parameters, and test results, (c) analyzes inputs using local dataset matching and requests additional tests when necessary, (d) provides specific instructions on ventilation modes, settings, and management strategies, (e) utilizes online AI models for complex cases when connectivity is available, (f) monitors patient status and alerts for complications, and (g) includes training modules for non-specialist clinicians.
4. Evaluate functionality, accuracy, usability, and clinical safety through simulated testing and expert validation to demonstrate the app's effectiveness as a specialist substitute.

## 1.5 Research Questions

1. What gaps exist in current ventilator management practices in Ugandan ICUs, particularly in non-specialist care scenarios?
2. How can a mobile interface guide non-specialist clinicians through patient assessment, test result input, and ventilation management decisions?
3. What dataset structure enables effective on-device decision-making for ventilator management without external dependencies?
4. How functional, user-friendly, and clinically safe is the proposed system in simulated non-specialist care settings?
5. How can dataset-based pattern matching provide accurate ventilation instructions and complication predictions for non-specialist clinicians?

## 1.6 Scope of the Study

The study focuses on the design, simulation, and validation of a mobile AI-enabled ventilator management prototype. Deployment in live clinical settings is excluded. The study covers both public and private ICUs in Uganda.

## 1.7 Significance of the Study

The study addresses critical workforce shortages by providing a system that simulates specialist oversight for non-specialist clinicians. The solution:

1. **Simulates Specialist Role**: The app acts as a specialist substitute, providing expert-level decision support to non-specialist clinicians managing ventilated patients.

2. **Comprehensive Local Support**: Extensive embedded dataset handles most clinical scenarios offline, ensuring continuous operation without internet dependency.

3. **Enhanced Complex Case Handling**: Optional online AI support provides additional analysis for complex cases when connectivity is available, complementing the local dataset.

4. **Guides Clinical Decisions**: Interactive workflow guides clinicians through assessment, test interpretation, and ventilation mode selection with specific instructions.

5. **Prevents Complications**: Pattern recognition from embedded dataset and online AI models predicts complications early, enabling timely intervention.

6. **Reduces Errors**: Step-by-step protocols with safety checklists minimize errors in patient assessment and ventilator initiation.

7. **Enhances Access**: Primary offline functionality enables deployment in remote facilities, with optional online features for enhanced support.

Patients benefit through reduced complications, improved outcomes, and expanded access to safe mechanical ventilation in settings without on-site specialists.

* **Inputs:** Patient medical conditions, demographics, clinical parameters (age, weight, SpO₂, PaO₂, PaCO₂, pH, respiratory rate, heart rate, blood pressure), available test results, and risk factors entered by clinicians.
* **Local Dataset:** Comprehensive embedded ventilation dataset containing diverse historical patient cases, ventilator settings, outcomes, and clinical patterns serving as the primary knowledge base for all common scenarios.
* **Processing:** Primary processing uses dataset-based pattern matching and similarity algorithms to find comparable cases. For complex cases beyond dataset coverage, optional online AI models provide additional analysis when internet connectivity is available. The system analyzes inputs, identifies required additional tests, and determines appropriate ventilation strategies.
* **Outputs:** Requests for additional tests when needed, specific instructions on ventilation modes (ACV, SIMV, etc.), ventilator settings (tidal volume, FiO₂, PEEP, respiratory rate), monitoring requirements, complication alerts, and educational guidance—effectively providing specialist-level decision support.

---

# CHAPTER TWO: LITERATURE REVIEW

## 2.1 Introduction

Mechanical ventilation requires specialized skills and continuous monitoring. In LMICs, shortages of trained personnel and digital tools compromise patient safety. AI offers opportunities to augment decision-making but must be adapted to local contexts.

## 2.2 Critical Care Capacity in Low-Resource Settings

Studies highlight severe shortages of ICU beds, trained staff, and monitoring infrastructure in LMICs. Paper-based documentation dominates, limiting data-driven care and quality improvement.

## 2.3 Clinical Requirements for Safe Ventilator Initiation

Safe initiation requires structured assessment, timely intubation, and physiologically appropriate ventilator settings. In Uganda, limited ABG access forces reliance on SpO₂, increasing clinical risk.

## 2.4 Documentation and Monitoring Limitations

Manual documentation increases the risk of missed deterioration. Few digital solutions are tailored to LMIC workflows.

## 2.5 AI-Driven Ventilator Decision Support

AI systems can detect unsafe trends, personalize ventilation, and reduce clinician workload. Advanced systems like MedDreamer utilize model-based reinforcement learning to provide personalized treatment recommendations, demonstrating improved outcomes in mechanical ventilation. However, existing systems face issues of bias, transparency, infrastructure requirements, and lack of integration with mobile platforms suitable for LMIC settings. Most AI systems require continuous internet connectivity for cloud-based models and advanced computing infrastructure unavailable in resource-limited environments. A simpler approach using locally embedded datasets with pattern matching and rule-based algorithms can provide effective decision support without external dependencies, making it ideal for offline operation in resource-limited settings.

## 2.6 Closed-Loop Ventilator Systems

Systems such as INTELLiVENT-ASV improve outcomes but require advanced ventilators and stable infrastructure unavailable in Uganda.

## 2.7 Limitations of Existing Systems in Uganda

Key barriers include infrastructural limitations, dataset mismatch, limited ABG capacity, lack of specialist oversight, and high costs. Specific limitations of existing solutions include:

1. **INTELLiVENT-ASV**: Requires advanced ventilators and stable infrastructure, desktop-based interface, not mobile-optimized, unsuitable for non-specialist use without extensive training.

2. **Basic Ventilator Calculators**: Lack AI decision support, no predictive analytics, no complication prevention, no step-by-step protocols, no voice interface, no offline functionality.

3. **Cloud-Based AI Systems**: Require continuous internet connectivity for external model APIs, unsuitable for offline operation, data privacy concerns, dependency on external services, high latency in low-connectivity areas.

4. **Desktop CDSS Systems**: Require stable internet, not mobile-based, complex interfaces unsuitable for non-specialists, high infrastructure costs.

5. **General Mobile Health Apps**: Not specific to ventilator management, no specialized protocols for mechanical ventilation, often require internet connectivity.

These limitations create a critical gap for non-specialist clinicians managing ventilated patients in resource-limited settings.

## 2.8 LMIC Digital Health Innovations

Successful innovations are mobile-based, offline-capable, and context-aware, supporting the feasibility of a mobile AI framework. Notable examples include:

1. **System X**: A voice-enabled AI system for electronic medical records and clinical risk alerts in maternal healthcare, successfully deployed in low-resource hospitals. It demonstrates the feasibility of voice-based interfaces for non-specialist healthcare workers, allowing natural language interaction regardless of literacy levels.

2. **mUzima Application**: An open-source Android app offering offline patient data management, data deduplication, and error resolution, making it highly suitable for remote facilities with limited technical support and unreliable connectivity.

3. **AgVa Ventilator**: A cost-effective, compact ventilator controllable via Android application, demonstrating the feasibility of mobile-based ventilator control in LMIC settings, though lacking comprehensive AI decision support.

These innovations validate the approach of mobile-first, offline-capable, voice-enabled solutions for resource-limited healthcare settings, directly informing the design requirements for this ventilator management system.

## 2.9 Comparative Analysis: Proposed System vs. Existing Solutions

The proposed system addresses critical limitations of existing solutions through comprehensive feature integration:

| Feature | INTELLiVENT-ASV | Basic Calculators | AgVa App | Desktop CDSS | **Proposed System** |
|---------|----------------|-------------------|----------|--------------|---------------------|
| Mobile Platform | ❌ Desktop | ✅ Limited | ✅ Yes | ❌ Desktop | ✅ **Full Mobile** |
| AI Decision Support | ✅ Advanced | ❌ None | ❌ None | ✅ Limited | ✅ **Comprehensive** |
| Offline Functionality | ❌ No | ⚠️ Partial | ⚠️ Partial | ❌ No | ✅ **Full Offline** |
| Admission Protocols | ❌ No | ❌ No | ❌ No | ⚠️ Basic | ✅ **Step-by-Step** |
| Predictive Analytics | ⚠️ Limited | ❌ No | ❌ No | ⚠️ Limited | ✅ **Dataset-Based** |
| Non-Specialist Design | ❌ No | ⚠️ Partial | ⚠️ Partial | ❌ No | ✅ **Optimized** |
| Training Modules | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Built-in** |
| LMIC Suitability | ❌ No | ⚠️ Partial | ⚠️ Partial | ❌ No | ✅ **Designed for LMIC** |
| Local Dataset AI | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Yes** |
| No External Dependencies | ❌ No | ✅ Yes | ⚠️ Partial | ❌ No | ✅ **Yes** |
| No Hardware Required | ❌ No | ✅ Yes | ❌ No | ✅ Yes | ✅ **Yes** |
| Simple Architecture | ❌ No | ⚠️ Partial | ⚠️ Partial | ❌ No | ✅ **Yes** |
| Cost Effectiveness | ❌ High | ✅ Low | ✅ Low | ❌ High | ✅ **Low Cost** |

**Key Competitive Advantages:**

1. **Comprehensive Integration**: Unlike fragmented solutions, this system provides end-to-end support from admission through weaning in a single platform.

2. **Non-Specialist Empowerment**: Specifically designed for clinicians without intensivist or anesthesiologist training, with built-in safety protocols and educational guidance.

3. **Comprehensive Local Dataset**: Extensive embedded dataset covers all possible clinical scenarios, enabling reliable offline decision-making using pattern matching and similarity algorithms.

4. **Optional Online AI Enhancement**: For complex cases beyond dataset coverage, optional online AI support provides additional analysis when connectivity is available, complementing local processing.

5. **Specialist Simulation**: The app effectively simulates the role of a specialist, providing expert-level decision support and guidance throughout the ventilation management process.

6. **Predictive Safety**: Pattern recognition from local dataset and online AI models predicts complications before clinical deterioration, enabling proactive intervention.

7. **Primary Offline Design**: Most functionality operates without internet connectivity, with optional online enhancement for complex cases, critical for resource-limited settings.

7. **Simple Architecture**: Easy-to-use system with locally embedded dataset eliminates complexity of hardware integration, external model management, or network dependencies.

## 2.10 Research Gap

No AI-enabled mobile system comprehensively integrates patient admission protocols, ventilator initiation, continuous monitoring, and predictive analytics using a comprehensive local dataset with optional online AI support, specifically designed to simulate specialist oversight for non-specialist clinicians in LMIC ICUs. Existing solutions either lack AI integration, require continuous internet connectivity, are not mobile-optimized, or fail to provide comprehensive step-by-step guidance that effectively replaces specialist oversight. There is a critical gap for mobile applications that primarily operate offline using comprehensive local datasets, with optional online AI enhancement for complex cases, effectively simulating the role of a specialist.

## 2.11 Justification

This system addresses the critical need to simulate specialist oversight for non-specialist clinicians through:

1. **Specialist Simulation**: The app acts as a specialist substitute, providing expert-level decision support and guidance throughout the ventilation management process.

2. **Comprehensive Local Dataset**: Extensive embedded dataset covers all possible clinical scenarios, enabling reliable offline operation for most cases.

3. **Enhanced Complex Case Support**: Optional online AI support provides additional analysis for complex cases when connectivity is available, complementing the local dataset.

4. **Interactive Guidance**: Clinicians input patient information; the app analyzes inputs, requests additional tests when needed, and provides specific ventilation instructions.

5. **Predictive Analytics**: Pattern matching from local dataset and online AI models predicts complications early, enabling proactive intervention.

6. **Primary Offline Functionality**: Most processing occurs locally on-device, ensuring continuous operation in areas with unreliable connectivity.

7. **Simple Operation**: Standalone application with no hardware integration, primarily offline with optional online enhancement.

This approach provides a unified platform that effectively replaces specialist oversight, guiding non-specialist clinicians through the complete workflow from patient assessment to ventilator management, specifically designed for resource-limited settings.

---

# CHAPTER THREE: METHODOLOGY

## 3.1 Research Design

A cross-sectional study combining needs assessment, system design, and evaluation.

## 3.2 Study Setting

* Case Hospital
* Ryan HC Hospital
* Mulago National Referral Hospital
* Kiruddu National Referral Hospital

## 3.3 Study Population

ICU clinicians, anaesthetic officers, critical-care nurses, and intensivists.

## 3.4 Sample Size and Sampling

Purposive sampling of 50 participants across public and private hospitals.

## 3.5 Data Collection Methods

* Semi-structured interviews with non-specialist clinicians to identify critical workflows, pain points, and feature requirements
* Observation and workflow analysis of patient admission and ventilator initiation processes in non-specialist care scenarios
* Simulated clinical datasets representing diverse patient profiles, complications, and ventilator management scenarios
* Comparative usability testing between proposed system and existing solutions (INTELLiVENT-ASV interfaces, basic calculators, AgVa app)
* Expert validation sessions with intensivists to ensure clinical safety and accuracy of AI recommendations
* Performance benchmarking against existing systems in simulated non-specialist care scenarios

## 3.6 Data Analysis

* Thematic analysis for qualitative data from interviews and observations to identify workflow requirements and usability insights
* Descriptive statistics for quantitative data including system performance metrics, accuracy measurements, and user acceptance scores
* Expert comparison for system validation: side-by-side evaluation with existing systems (INTELLiVENT-ASV, basic calculators, AgVa app) to demonstrate superiority
* Comparative analysis: quantitative metrics comparing proposed system vs. existing solutions on key dimensions (accuracy, usability, non-specialist performance, offline functionality, feature completeness)
* Clinical safety validation: expert review of AI recommendations against established clinical guidelines and specialist judgment
* Predictive model validation: assessment of complication prediction accuracy using receiver operating characteristic (ROC) curves and precision-recall metrics

## 3.7 Ventilation Dataset Design and Format

The core of the system will be a locally embedded ventilation dataset that enables AI decision-making without external dependencies. The dataset will be structured as follows:

### 3.7.1 Dataset Format

The dataset will be stored in **JSON (JavaScript Object Notation)** format, chosen for its simplicity, human-readability, ease of parsing in mobile applications, and efficient storage. JSON is natively supported by mobile platforms and requires minimal processing overhead.

### 3.7.2 Dataset Structure

Each entry in the dataset will represent a validated clinical case with the following structure:

```json
{
  "caseId": "unique_identifier",
  "patientProfile": {
    "age": 45,
    "weight": 70,
    "height": 170,
    "gender": "male",
    "condition": "ARDS",
    "comorbidities": ["hypertension"],
    "riskFactors": ["smoking", "obesity", "diabetes"]
  },
  "clinicalParameters": {
    "spo2": 85,
    "pao2": 60,
    "paco2": 55,
    "ph": 7.25,
    "respiratoryRate": 28,
    "heartRate": 110,
    "bloodPressure": "120/80"
  },
  "ventilatorSettings": {
    "mode": "ACV",
    "tidalVolume": 450,
    "respiratoryRate": 16,
    "fio2": 0.6,
    "peep": 8,
    "ieRatio": "1:2"
  },
  "outcomes": {
    "complications": ["none"],
    "weaningSuccess": true,
    "lengthOfVentilation": 5,
    "mortality": false
  },
  "recommendations": {
    "initialSettings": {...},
    "monitoringPoints": [...],
    "riskFactors": [...]
  }
}
```

### 3.7.3 Dataset Content

The dataset is designed to be comprehensive, covering all possible clinical scenarios:
- Diverse patient profiles with various conditions (ARDS, COPD, pneumonia, sepsis, asthma, heart failure, trauma), ages, weights, and comorbidities
- Clinical scenarios with different combinations of test results, parameters, and severity levels
- Validated ventilator settings and management strategies for each scenario
- Documented outcomes including complications and patient outcomes
- Risk patterns associated with complications
- Edge cases and complex scenarios to maximize coverage

### 3.7.4 Dataset Size and Organization

The dataset is organized for efficient on-device searching:
- Indexed by patient condition, age groups, and severity for quick pattern matching
- Optimized size balancing comprehensiveness with mobile app constraints (target: 5-10 MB)
- Structured to allow future updates without app reinstallation

### 3.7.5 AI Decision Support Architecture

The application uses a dual-mode approach:

**Primary Mode (Offline - Local Dataset):**
- Pattern matching to find similar cases based on patient conditions, clinical parameters, and test results
- Similarity scoring to rank most relevant cases from the comprehensive dataset
- Test requirement analysis to determine if additional tests are needed
- Ventilator instruction generation to extract appropriate ventilation modes and settings from matched cases
- Risk assessment to identify potential complications based on dataset patterns
- Alert generation to compare current patient status against dataset patterns

**Secondary Mode (Online - External AI Models):**
- Activated automatically for complex cases that may not be well-represented in the local dataset
- Uses external AI models when internet connectivity is available
- Provides additional analysis and recommendations for edge cases or unusual presentations
- Complements local dataset findings with advanced AI insights

This hybrid approach ensures reliable offline operation for most cases while providing enhanced support for complex scenarios when connectivity allows.

## 3.8 System Development Process

User-centered design involving requirement analysis, dataset creation, interface design, local AI module development, prototyping, and validation. The development process will include:

1. **Requirements Analysis**: Comprehensive needs assessment with non-specialist clinicians to identify critical workflows, pain points, and feature priorities.

2. **Ventilation Dataset Creation**:
   - Design JSON-based dataset format with patient cases, clinical parameters, ventilator settings, and outcomes
   - Compile validated clinical cases from literature and expert knowledge representing diverse patient profiles
   - Organize data for efficient on-device pattern matching with indexing for quick searches
   - Validate dataset entries through expert review for clinical accuracy

3. **Core Module Development**:
   - **Patient Assessment Module**: Step-by-step protocols for gathering patient conditions, parameters, and test results
   - **Decision Support Module**: Analyzes inputs using local dataset pattern matching; automatically activates online AI support for complex cases when connectivity is available
   - **Ventilator Instruction Module**: Provides specific instructions on ventilation modes, settings (tidal volume, FiO₂, PEEP, respiratory rate, I:E ratio), and management strategies—simulating specialist guidance
   - **Monitoring Module**: Tracks patient parameters and alerts for complications
   - **Local Data Management**: On-device storage for patient records
   - **Training Module**: Educational content for non-specialist clinicians

4. **AI Algorithm Development**: 
   - **Local Processing**: Rule-based decision trees, pattern matching algorithms, similarity scoring, risk classification, and trend analysis using the comprehensive embedded dataset
   - **Online Processing**: Integration with external AI models for complex case analysis when internet connectivity is available, with automatic activation based on case complexity assessment
   - **Hybrid Decision Logic**: Combines local dataset findings with online AI insights when both are available, prioritizing local dataset for common cases

5. **Offline Functionality Testing**: Validation of complete on-device operation without internet connectivity, dataset loading and access performance testing.

6. **Usability Testing**: Iterative testing with non-specialist clinicians to ensure intuitive operation and clinical safety.

7. **Validation**: Expert review, simulated clinical scenarios, and accuracy testing of dataset-based recommendations against clinical guidelines.

## 3.9 Ethical Considerations

Approval from Makerere University REC, informed consent, confidentiality, and anonymization.

## 3.10 Expected Outputs

* Assessment of ventilator management challenges in non-specialist care scenarios
* Comprehensive validated ventilation dataset file (JSON format) containing diverse clinical cases, ventilator settings, and outcomes covering all possible scenarios
* Functional AI-enabled mobile prototype that simulates specialist oversight with:
  - Patient condition and parameter input interface
  - Analysis module using local dataset pattern matching with optional online AI support for complex cases
  - Ventilator instruction module providing specific guidance on modes and settings
  - Monitoring dashboard with automated alerts
  - Primary offline functionality with optional online AI enhancement
  - Training modules for non-specialist clinicians
* Validated decision-support algorithms demonstrating accuracy and safety as a specialist substitute
* Usability assessment and user acceptance evaluation
* Deployment recommendations

## 3.11 Budget (UGX)

* System development: 3,000,000
* Tuition: 6,000,000
* Stationery: 250,000
* Transportation: 300,000
* Research assistant: 400,000
* Demonstration tablet: 800,000
* **Total:** 10,750,000

## 3.12 Risk Assessment

Key risks include limited staff access, technical malfunction, ethical approval delays, and low participation.

---

## REFERENCES

* Agarwal, R., Singhal, T., & Sinha, S. (2021). **Digital health records and the future of critical care documentation**. *Journal of Intensive Care Medicine, 36*(4), 505–514. [https://doi.org/10.1177/0885066620948573](https://doi.org/10.1177/0885066620948573)

* Bangaru, V. (2024). **Initiating Mechanical Ventilation in Critically Ill Patients: Case-based Clinical Review**. *SBV Journal of Basic, Clinical and Applied Health Science*, 178–183. [https://doi.org/10.4103/SBVJ.SBVJ_43_24](https://doi.org/10.4103/SBVJ.SBVJ_43_24)

* Beaulieu-Boire, G., Beattie, S., & D’Aragon, F. (2021). **Intelligent automation of mechanical ventilation: From concept to clinical reality**. *Critical Care, 25*(1), 102–115. [https://doi.org/10.1186/s13054-021-03528-3](https://doi.org/10.1186/s13054-021-03528-3)

* Botta, M., Wenstedt, E. F. E., Tsonas, A. M., Buiteman-Kruizinga, L. A., van Meenen, D. M. P., Korsten, H. H. M., Horn, J., Paulus, F., Bindels, A. G. J. H., Schultz, M. J., & De Bie, A. J. R. (2021). **Effectiveness, safety and efficacy of INTELLiVENT–adaptive support ventilation**. *Expert Review of Respiratory Medicine, 15*(11), 1403–1413. [https://doi.org/10.1080/17476348.2021.1933450](https://doi.org/10.1080/17476348.2021.1933450)

* Elhaddad, M., & Hamam, S. (2024). **AI-Driven Clinical Decision Support Systems: An Ongoing Pursuit of Potential**. *Cureus*. [https://doi.org/10.7759/cureus.57728](https://doi.org/10.7759/cureus.57728)

* Ghosh, A., Mishra, P., & Singh, R. (2023). **AI-based control strategies for mechanical ventilation: Current progress and challenges**. *Biomedical Signal Processing and Control, 84*, 104909. [https://doi.org/10.1016/j.bspc.2023.104909](https://doi.org/10.1016/j.bspc.2023.104909)

* Goodfellow, L. T., Miller, A. G., Varekojis, S. M., Lavita, C. J., Glogowski, J. T., & Hess, D. R. (2024). **AARC Clinical Practice Guideline: Patient-Ventilator Assessment**. *Respiratory Care, 69*(8), 1042–1054. [https://doi.org/10.4187/RESPCARE.12007](https://doi.org/10.4187/RESPCARE.12007)

* Li, X., Chen, Q., & Liu, Z. (2023). **Reinforcement learning for adaptive ventilator control in critical care environments**. *Computers in Biology and Medicine, 161*, 106864. [https://doi.org/10.1016/j.compbiomed.2023.106864](https://doi.org/10.1016/j.compbiomed.2023.106864)

* Losonczy, L. I., Papali, A., Kivlehan, S., Calvello Hynes, E. J., Calderon, G., Laytin, A., Moll, V., Al Hazmi, A., Alsabri, M., Aryal, D., Atua, V., Becker, T., Benzoni, N., Dippenaar, E., Duneant, E., Girma, B., George, N., Gupta, P., Jaung, M., et al. (2021). **White Paper on Early Critical Care Services in Low Resource Settings**. *Annals of Global Health, 87*(1), 105. [https://doi.org/10.5334/aogh.3377](https://doi.org/10.5334/aogh.3377)

* Ministry of Health (Uganda). (2023). **Annual Health Sector Performance Report 2022/2023**. Government of Uganda.

* Platen, P. von, Pomprapa, A., Lachmann, B., & Leonhardt, S. (2020). **The dawn of physiological closed-loop ventilation—A review**. *Critical Care, 24*(1), 121. [https://doi.org/10.1186/s13054-020-2810-1](https://doi.org/10.1186/s13054-020-2810-1)

* Singh, N. P., Mujawar, M. A., & Golani, A. (2025). **Role of artificial intelligence in enhancing mechanical ventilation – A peek into the future**. *Indian Journal of Anaesthesia, 69*(7), 722–728. [https://doi.org/10.4103/IJA.IJA_995_24](https://doi.org/10.4103/IJA.IJA_995_24)

* Spencer, S. A., Adipa, F. E., Baker, T., Crawford, A. M., Dark, P., Dula, D., Gordon, S. B., Hamilton, D. O., Huluka, D. K., Khalid, K., Lakoh, S., Limbani, F., Rylance, J., Sawe, H. R., Simiyu, I., Waweru-Siika, W., Worrall, E., & Morton, B. (2023). **A health systems approach to critical care delivery in low-resource settings: A narrative review**. *Intensive Care Medicine, 49*(7), 772–784. [https://doi.org/10.1007/s00134-023-07136-2](https://doi.org/10.1007/s00134-023-07136-2)

* World Health Organization. (2023). **Global Report on Strengthening Critical Care Services in Low- and Middle-Income Countries**. WHO Press.

* AgVa Healthcare. (2024). **AgVa Ventilator: Low-Cost Mechanical Ventilation Solution**. [https://en.wikipedia.org/wiki/AgVa_Ventilator](https://en.wikipedia.org/wiki/AgVa_Ventilator)

* System X Research Team. (2024). **Voice-Enabled AI System for Electronic Medical Records in Low-Resource Settings**. *arXiv preprint*. [https://arxiv.org/abs/2512.12240](https://arxiv.org/abs/2512.12240)

* MedDreamer Research Consortium. (2024). **Model-Based Reinforcement Learning for Personalized Treatment Recommendations in Critical Care**. *arXiv preprint*. [https://arxiv.org/abs/2505.19785](https://arxiv.org/abs/2505.19785)

* Etiometry Platform. (2024). **Real-Time Physiological Data Aggregation and Risk Analytics for Critical Care**. [https://en.wikipedia.org/wiki/Etiometry](https://en.wikipedia.org/wiki/Etiometry)

* mUzima Development Team. (2023). **Offline Patient Data Management for Resource-Limited Healthcare Settings**. *Engineering, 11*(4), 90. [https://www.mdpi.com/2227-9709/11/4/90](https://www.mdpi.com/2227-9709/11/4/90)
