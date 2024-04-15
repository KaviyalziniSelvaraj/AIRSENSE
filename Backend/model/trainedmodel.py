# -*- coding: utf-8 -*-
import sys
import pandas as pd
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import numpy as np
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_error
from sklearn.ensemble import RandomForestRegressor

df = pd.read_csv('delhi_aqi.csv')

df = df.dropna()
df = df[(df != 0).all(1)]

df.to_csv('cleaned_dataset.csv', index=False)

def calculate_aqi_for_pollutant(concentration, pollutant):
    if pollutant == 'NO2':
        breakpoints = [0, 54, 101, 361, 650, 1250, 1650, 2049, 4000]
        AQI_values = [0, 50, 100, 200, 300, 400, 500]
    elif pollutant == 'SO2':
        breakpoints = [0, 36, 76, 186, 305, 605, 805, 1005, 5000]
        AQI_values = [0, 50, 100, 150, 200, 300, 400, 500]
    elif pollutant == 'O3':
        breakpoints = [0, 55, 71, 86, 106, 200, 405, 504]
        AQI_values = [0, 50, 100, 150, 200, 300, 400, 500]
    elif pollutant == 'PM2.5':
        breakpoints = [0, 12, 35.4, 55.4, 150.4, 250.4, 350.4, 500.4]
        AQI_values = [0, 50, 100, 150, 200, 300, 400, 500]
    else:
        raise ValueError("Invalid pollutant. Please choose 'NO2', 'CO', 'SO2', 'O3', or 'PM2.5'.")

    return calculate_aqi(concentration, breakpoints, AQI_values)

def calculate_aqi(concentration, breakpoints, AQI_values):
    for i in range(len(breakpoints) - 1):
        if breakpoints[i] <= concentration <= breakpoints[i + 1]:
            conc_low = breakpoints[i]
            conc_high = breakpoints[i + 1]
            aqi_low = AQI_values[i]
            aqi_high = AQI_values[i + 1]
            aqi = ((aqi_high - aqi_low) / (conc_high - conc_low)) * (concentration - conc_low) + aqi_low
            return aqi
    return None

df.drop(columns=['co'], inplace=True)
df['pm2_5'] = ((df['pm2_5'] - df['pm2_5'].min()) / (df['pm2_5'].max() - df['pm2_5'].min())) * 500
df['pm2_5'] = df['pm2_5'].apply(lambda x: min(x, 500))
df.to_csv('updatedAQI.csv', index=False)

df['AQI_no2'] = df['no2'].apply(lambda x: calculate_aqi_for_pollutant(x, 'NO2'))
df['AQI_so2'] = df['so2'].apply(lambda x: calculate_aqi_for_pollutant(x, 'SO2'))
df['AQI_o3'] = df['o3'].apply(lambda x: calculate_aqi_for_pollutant(x, 'O3'))
df['AQI_pm2_5'] = df['pm2_5'].apply(lambda x: calculate_aqi_for_pollutant(x, 'PM2.5'))

df.to_csv('updatedAQI.csv', index=False)

def health_issues_and_remedies_for_pollutant_aqi(pollutant, aqi):
    if pollutant == 'NO2':
        if aqi >= 0 and aqi <= 50:
            issue = "Minor respiratory irritation(NO2)"
            remedies = "Spend more time indoors in well-ventilated areas, avoid strenuous outdoor activities."
        elif aqi >= 51 and aqi <= 100:
            issue = "Increased respiratory symptoms in sensitive individuals(NO2)"
            remedies = "Limit outdoor activities, use air purifiers indoors."
        elif aqi >= 101 and aqi <= 150:
            issue = "Aggravation of respiratory conditions (asthma, bronchitis)(NO2)"
            remedies = "Stay indoors, use air purifiers with HEPA filters, consider wearing masks."
        else:
            issue = "Severe respiratory distress(NO2)"
            remedies = "Remain indoors with air purifiers, seek medical attention if symptoms worsen."
    elif pollutant == 'pm2_5':
        if aqi >= 0 and aqi <= 100:
            issue = "Minor headaches(pm2_5)"
            remedies = "Ventilate indoor spaces, reduce sources of CO (e.g., gas appliances)."
        elif aqi >= 100 and aqi <= 200:
            issue = "Headaches, dizziness(pm2_5)"
            remedies = "Increase ventilation, avoid using gas stoves without proper exhaust."
        elif aqi >= 200 and aqi <= 250:
            issue = "Nausea, fatigue(pm2_5)"
            remedies = "Immediately ventilate area, seek fresh air, and avoid further exposure."
        else:
            issue = "Severe symptoms (unconsciousness, death)(pm2_5)"
            remedies = "Evacuate to fresh air, seek medical attention immediately."
    elif pollutant == 'SO2':
        if aqi >= 0 and aqi <= 50:
            issue = "Minor respiratory irritation(SO2)"
            remedies = "Limit outdoor activities, use air purifiers indoors."
        elif aqi >= 51 and aqi <= 100:
            issue = "Increased respiratory symptoms in sensitive individuals(SO2)"
            remedies = "Avoid strenuous outdoor activities, use air purifiers indoors."
        elif aqi >= 101 and aqi <= 150:
            issue = "Aggravation of respiratory conditions (asthma, bronchitis)(SO2)"
            remedies = "Stay indoors, use air purifiers with HEPA filters, consider wearing masks."
        else:
            issue = "Severe respiratory distress(SO2)"
            remedies = "Remain indoors with air purifiers, seek medical attention if symptoms worsen."
    elif pollutant == 'O3':
        if aqi >= 0 and aqi <= 50:
            issue = "Minor respiratory irritation(O3)"
            remedies = "Limit outdoor activities, use air purifiers indoors."
        elif aqi >= 51 and aqi <= 100:
            issue = "Increased respiratory symptoms in sensitive individuals(O3)"
            remedies = "Avoid strenuous outdoor activities, use air purifiers indoors."
        elif aqi >= 101 and aqi <= 150:
            issue = "Aggravation of respiratory conditions (asthma, bronchitis)(O3)"
            remedies = "Stay indoors, use air purifiers with HEPA filters, consider wearing masks."
        else:
            issue = "Severe respiratory distress(O3)"
            remedies = "Remain indoors with air purifiers, seek medical attention if symptoms worsen."
    else:
        issue = "Invalid pollutant"
        remedies = "N/A"

    return issue, remedies

no2=df['AQI_no2']
so2=df['AQI_so2']
pm2_5=df['AQI_pm2_5']
o3=df['AQI_o3']
AQI=[]
issues=[]
remedies=[]
for i in range(len(df)):
    no2= df['AQI_no2'].iloc[i]
    so2=df['AQI_so2'].iloc[i]
    pm2_5=df['AQI_pm2_5'].iloc[i]
    o3=df['AQI_o3'].iloc[i]
    maxv = max(no2, so2, pm2_5,o3)
    AQI.append(maxv)
    if maxv == no2:
        pollutant = "NO2"
    elif maxv == so2:
        pollutant = "SO2"
    elif maxv == pm2_5:
        pollutant = "pm2_5"
    else:
        pollutant = "O3"
    [issue,remedy]=health_issues_and_remedies_for_pollutant_aqi(pollutant,maxv)
    issues.append(issue)
    remedies.append(remedy)
df['issues']=issues
df['remedies']=remedies
df['AQI']=AQI
df.to_csv('updatedAQI.csv', index=False)

# Load the cleaned dataset
df = pd.read_csv('updatedAQI.csv')

# Drop rows with missing values
df.dropna(inplace=True)

# Define features (X)
X = df[['AQI_no2', 'AQI_so2', 'AQI_o3', 'AQI_pm2_5']].astype(float)

# Define targets (y)
y_AQI = df['AQI'].astype(float)
y_issues = df['issues']
y_remedies = df['remedies']

# Split the data into training and testing sets
X_train, X_test, y_AQI_train, y_AQI_test, y_issues_train, y_issues_test, y_remedies_train, y_remedies_test = train_test_split(X, y_AQI, y_issues, y_remedies, test_size=0.2, random_state=42)

# Train Random Forest models for AQI prediction
rf_model_AQI_train = RandomForestRegressor(max_depth=10, min_samples_leaf=5, n_estimators=100)
rf_model_AQI_train.fit(X_train, y_AQI_train)

# Predict AQI values on the training set
predictions_AQI_train = rf_model_AQI_train.predict(X_train)

# Predict AQI values on the testing set
predictions_AQI_test = rf_model_AQI_train.predict(X_test)

# Calculate evaluation metrics for AQI prediction
mse_AQI_train = mean_squared_error(y_AQI_train, predictions_AQI_train)
mae_AQI_train = mean_absolute_error(y_AQI_train, predictions_AQI_train)
r2_AQI_train = r2_score(y_AQI_train, predictions_AQI_train)

mse_AQI_test = mean_squared_error(y_AQI_test, predictions_AQI_test)
mae_AQI_test = mean_absolute_error(y_AQI_test, predictions_AQI_test)
r2_AQI_test = r2_score(y_AQI_test, predictions_AQI_test)

# Train Random Forest models for issues prediction
rf_model_issues_train = RandomForestClassifier(n_estimators=100)
rf_model_issues_train.fit(X_train, y_issues_train)

# Predict issues on the training set
predictions_issues_train = rf_model_issues_train.predict(X_train)

# Predict issues on the testing set
predictions_issues_test = rf_model_issues_train.predict(X_test)

# Calculate accuracy for issues prediction
accuracy_issues_train = accuracy_score(y_issues_train, predictions_issues_train)
accuracy_issues_test = accuracy_score(y_issues_test, predictions_issues_test)

# Train Random Forest models for remedies prediction
rf_model_remedies_train = RandomForestClassifier(n_estimators=100)
rf_model_remedies_train.fit(X_train, y_remedies_train)

# Predict remedies on the training set
predictions_remedies_train = rf_model_remedies_train.predict(X_train)

# Predict remedies on the testing set
predictions_remedies_test = rf_model_remedies_train.predict(X_test)

# Calculate accuracy for remedies prediction
accuracy_remedies_train = accuracy_score(y_remedies_train, predictions_remedies_train)
accuracy_remedies_test = accuracy_score(y_remedies_test, predictions_remedies_test)

if __name__ == "__main__":
    no2 = float(sys.argv[1])
    so2 = float(sys.argv[2])
    o3 = float(sys.argv[3])
    pm2_5 = float(sys.argv[4])

    input_data = np.array([[no2, so2, o3, pm2_5]])
    aqi_pred = rf_model_AQI_train.predict(input_data)


    issues_pred = rf_model_issues_train.predict(input_data)
    remedies_pred = rf_model_remedies_train.predict(input_data)

    print( aqi_pred[0],":",issues_pred[0],":",remedies_pred[0])
    # Print the predicted values
"""  print("Predicted AQI:", aqi_pred)
    print("Predicted Issues:", issues_pred)
    print("Predicted Remedies:", remedies_pred) """
    