!pip install pingouin==0.5.5
import pandas as pd
import scipy.stats as stats
import statsmodels.api as sm
import numpy as np
import pingouin as pg
data = pd.read_csv("DDB.csv", sep=',')
data = data.apply(lambda x: x.str.replace(',', '.', regex=True) if x.dtype == "object" else x)
data = data.apply(pd.to_numeric, errors='ignore')
# Определяем переменные для анализа
variables = [
    'SUS_T1_Result', 'SUS_T2_Result',
    'Gallup_T1_Result', 'Gallup_T2_Result',
    'MSQ_T1_Result', 'MSQ_T2_Result',
    'Autonomy_T1', 'Autonomy_T2',
    'Competence_T1', 'Competence_T2',
    'Relatedness_T1', 'Relatedness_T2'
]

control_group = data[data['Group'] == 'control']
experimental_group = data[data['Group'] == 'experimental']

# Шапиро–Уилка
def check_normality(group, group_name):
    results = []
    for var in variables:
        stat, p = stats.shapiro(group[var].dropna())  
        result = "Нормально распределено" if p > 0.050 else "Ненормально распределено"
        results.append([group_name, var, p, result])

    # Создаем таблицу с результатами
    df_results = pd.DataFrame(results, columns=["Группа", "Переменная", "p-value", "Распределение"])
    return df_results

# Проверяем нормальность распределения для обеих групп
df_control = check_normality(control_group, "Контрольная")
df_experimental = check_normality(experimental_group, "Экспериментальная")
df_normality_results = pd.concat([df_control, df_experimental], ignore_index=True)
df_normality_results
