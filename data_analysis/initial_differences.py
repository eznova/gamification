import pandas as pd
import scipy.stats as stats
import numpy as np

# Загружаем данные
data = pd.read_csv("DDB.csv", sep=',')
data = data.apply(lambda x: x.str.replace(',', '.', regex=True) if x.dtype == "object" else x)
data = data.apply(pd.to_numeric, errors='ignore')

# Разделяем на контрольную и экспериментальную группы
control_group = data[data['Group'] == 'control']
experimental_group = data[data['Group'] == 'experimental']

# Список переменных
t1_variables = [
    'SUS_T1_Result',
    'Gallup_T1_Result',
    'MSQ_T1_Result',
    'Autonomy_T1',
    'Competence_T1',
    'Relatedness_T1'
]

# Инициализация словаря для проверки нормальности распределения
normality = {}

# Применяем тест Шапиро-Уилка для каждой переменной
for var in t1_variables:
    control_data = control_group[var].dropna()  # выбираем данные для контрольной группы
    exp_data = experimental_group[var].dropna()  # выбираем данные для экспериментальной группы

    # Применяем тест Шапиро-Уилка для контрольной группы
    stat, p = stats.shapiro(control_data)
    normality[var] = p > 0.05  # Если p > 0.05, распределение можно считать нормальным

# Инициализация списка для сохранения результатов
results = []

# Сравнительная статистика
for var in t1_variables:
    # Извлекаем данные для контрольной и экспериментальной групп
    control_data = control_group[var].dropna()
    experimental_data = experimental_group[var].dropna()

    # Средние и стандартные отклонения
    control_mean = control_data.mean()
    control_std = control_data.std()
    exp_mean = experimental_data.mean()
    exp_std = experimental_data.std()

    # Выбор статистического теста
    if normality[var]:  # Если данные нормальны, используем t-тест
        stat, p = stats.ttest_ind(control_data, experimental_data, equal_var=False)
        test_used = "t-тест (независимые выборки)"
    else:  # Если данные не нормальны, используем U-критерий Манна–Уитни
        stat, p = stats.mannwhitneyu(control_data, experimental_data, alternative='two-sided')
        test_used = "U-критерий Манна–Уитни"

    # Добавляем результаты в список
    results.append([
        var,
        test_used,
        p,
        control_mean,
        control_std,
        exp_mean,
        exp_std
    ])

# Создание DataFrame с результатами
df_comparison_results = pd.DataFrame(results, columns=[
    "Переменная",
    "Тест",
    "p-value",
    "Среднее (контроль)",
    "Ст. отклонение (контроль)",
    "Среднее (эксперимент)",
    "Ст. отклонение (эксперимент)"
])

df_comparison_results
