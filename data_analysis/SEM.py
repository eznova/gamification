pip install semopy
!pip install pingouin==0.5.5
import pandas as pd
import scipy.stats as stats
import statsmodels.api as sm
import numpy as np
import pingouin as pg
data = pd.read_csv("DDB.csv", sep=',')

# Немного обрабатываем данные
data = data.apply(lambda x: x.str.replace(',', '.', regex=True) if x.dtype == "object" else x)
data = data.apply(pd.to_numeric, errors='ignore')

model_desc = """
# Игровые механики → Психологические потребности
Autonomy     ~ SUS
Competence   ~ SUS
Relatedness  ~ SUS

# Психологические потребности → Вовлеченность и удовлетворенность
Gallup       ~ Autonomy + Competence + Relatedness
MSQ          ~ Autonomy + Competence + Relatedness
"""

# Загрузка данных
df = data

df['Autonomy'] = df['Autonomy_T2'] - df['Autonomy_T1']
df['Competence'] = df['Competence_T2'] - df['Competence_T1']
df['Relatedness'] = df['Relatedness_T2'] - df['Relatedness_T1']
df['Gallup'] = df['Gallup_T2_Result'] - df['Gallup_T1_Result']
df['MSQ'] = df['MSQ_T2_Result'] - df['MSQ_T1_Result']
df['SUS'] = df['SUS_T2_Result'] - df['SUS_T1_Result']

# Связи модели
from semopy import Model, semplot
model = Model(model_desc)
res = model.fit(df)
estimates = model.inspect()
estimates = estimates.round(3)
estimates

# Метрики качества модели
from semopy import calc_stats
stats = calc_stats(model)
stats
