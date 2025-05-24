!pip install statsmodels==0.14.4
import pandas as pd
import scipy.stats as stats
import statsmodels.api as sm
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import pearsonr
data = pd.read_csv("DDB.csv", sep=',', decimal=',')

# Немного обрабатываем данные
data = data.apply(lambda x: x.str.replace(',', '.', regex=True) if x.dtype == "object" else x)
data = data.apply(pd.to_numeric, errors='ignore')
data = data.drop(columns=["Поле для дополнительных комментариев, посвященных геймификации"], errors='ignore')
data

# Список нужных переменных
columns = [
    'SUS_T1_Result', 'SUS_T2_Result',
    'Gallup_T1_Result', 'Gallup_T2_Result',
    'MSQ_T1_Result', 'MSQ_T2_Result',
    'Autonomy_T1', 'Autonomy_T2',
    'Competence_T1', 'Competence_T2',
    'Relatedness_T1', 'Relatedness_T2'
]

# Преобразуем числа из строк
for col in columns:
    data[col] = data[col].astype(str).str.replace(',', '.', regex=False).str.replace('%', '', regex=False).str.strip()
    data[col] = pd.to_numeric(data[col], errors='coerce')

# Убираем строки с пропущенными значениями
df = data[columns].dropna()

# Вычисляем корреляции и p-value
corr = df.corr()
pvals = pd.DataFrame(np.ones((len(columns), len(columns))), columns=columns, index=columns)

for row in columns:
    for col in columns:
        if row != col:
            r, p = pearsonr(df[row], df[col])
            pvals.loc[row, col] = p

# Создаем аннотированную матрицу с "звёздочками"
annot = corr.round(2).astype(str)
for i in range(len(columns)):
    for j in range(len(columns)):
        if i != j:
            if pvals.iloc[i, j] < 0.05:
                annot.iloc[i, j] += '*'

# Построение тепловой карты
plt.figure(figsize=(13, 11))
sns.heatmap(corr, annot=annot, fmt='', cmap='Purples', square=True, linewidths=0.5, cbar_kws={'shrink': 0.8})
plt.xticks(rotation=45, ha='right')
plt.yticks(rotation=0)
plt.tight_layout()
plt.show()
