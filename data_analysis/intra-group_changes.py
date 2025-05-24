import pandas as pd
import scipy.stats as stats
import statsmodels.api as sm
import numpy as np
data = pd.read_csv("DDB.csv", sep=',')
data = data.apply(lambda x: x.str.replace(',', '.', regex=True) if x.dtype == "object" else x)
data = data.apply(pd.to_numeric, errors='ignore')
control_group = data[data['Group'] == 'control']
experimental_group = data[data['Group'] == 'experimental']

# Определяем пары переменных (T1 vs. T2)
paired_variables = [
    ('SUS_T1_Result', 'SUS_T2_Result'),
    ('Gallup_T1_Result', 'Gallup_T2_Result'),
    ('MSQ_T1_Result', 'MSQ_T2_Result'),
    ('Autonomy_T1', 'Autonomy_T2'),
    ('Competence_T1', 'Competence_T2'),
    ('Relatedness_T1', 'Relatedness_T2')
]

# Словарь с информацией о нормальности переменных
normality_info = {
    'SUS': True,
    'Gallup': False,
    'MSQ': False,
    'Autonomy': True,  
    'Competence': True,  
    'Relatedness': True  
}

# Функция для анализа изменений внутри группы с добавлением статистик
def analyze_within_group(group, group_name):
    results = []
    for t1, t2 in paired_variables:
        var_name = t1.split('_T1')[0]  # Получаем название переменной (без _T1)

        group_data_t1 = group[t1].dropna()
        group_data_t2 = group[t2].dropna()

        # Выравниваем по индексам (на случай, если пропуски разные)
        common_indices = group_data_t1.index.intersection(group_data_t2.index)
        group_data_t1 = group_data_t1.loc[common_indices]
        group_data_t2 = group_data_t2.loc[common_indices]

        # Средние и стандартные отклонения
        mean_t1 = group_data_t1.mean()
        std_t1 = group_data_t1.std()
        mean_t2 = group_data_t2.mean()
        std_t2 = group_data_t2.std()

        # Выбор теста
        if normality_info[var_name]:
            stat, p = stats.ttest_rel(group_data_t1, group_data_t2, nan_policy='omit')
            test_used = "Парный t-тест"
        else:
            if len(group_data_t1) < 10:  # Wilcoxon требует минимум 10 наблюдений для стабильности
                stat, p = float('nan'), float('nan')
                test_used = "Критерий Вилкоксона (недостаточно данных)"
            else:
                stat, p = stats.wilcoxon(group_data_t1, group_data_t2)
                test_used = "Критерий Вилкоксона"

        results.append([
            group_name, var_name, test_used, p,
            mean_t1, std_t1, mean_t2, std_t2
        ])

    return pd.DataFrame(results, columns=[
        "Группа", "Переменная", "Тест", "p-value",
        "Среднее T1", "Ст. отклонение T1",
        "Среднее T2", "Ст. отклонение T2"
    ])

df_control_changes = analyze_within_group(control_group, "Контрольная")
df_experimental_changes = analyze_within_group(experimental_group, "Экспериментальная")

# Объединение результатов
df_within_group_changes = pd.concat([df_control_changes, df_experimental_changes], ignore_index=True)
df_within_group_changes

# Функция для анализа дельт внутри группы
def analyze_within_group(group, group_name):
    results = []
    for t1, t2 in paired_variables:
        var_name = t1.split('_T1')[0]  # Получаем название переменной (без _T1)
        
        group_data_t1 = group[t1].dropna()
        group_data_t2 = group[t2].dropna()

        # Проверяем нормальность
        if normality_info[var_name]:  
            stat, p = stats.ttest_rel(group_data_t1, group_data_t2, nan_policy='omit')
            test_used = "Парный t-тест"
        else:  
            stat, p = stats.wilcoxon(group_data_t1, group_data_t2)
            test_used = "Критерий Вилкоксона"

        # Добавляем результаты в список
        results.append([group_name, var_name, test_used, p])

    # Создаем DataFrame с результатами
    return pd.DataFrame(results, columns=["Группа", "Переменная", "Тест", "p-value"])

# Анализируем отдельно для контрольной и экспериментальной групп
df_control_changes = analyze_within_group(control_group, "Контрольная")
df_experimental_changes = analyze_within_group(experimental_group, "Экспериментальная")

# Объединяем таблицы
df_within_group_changes = pd.concat([df_control_changes, df_experimental_changes], ignore_index=True)
df_within_group_changes

# Список метрик без _T1/_T2
metrics = ['SUS', 'Gallup', 'MSQ', 'Autonomy', 'Competence', 'Relatedness']

# Формируем таблицу с дельтами
delta_table = pd.DataFrame({
    'Metric': metrics,
    'Control_Delta': [
        control_group[f'{m}_T2_Result'].mean() - control_group[f'{m}_T1_Result'].mean()
        if f'{m}_T2_Result' in control_group.columns else
        control_group[f'{m}_T2'].mean() - control_group[f'{m}_T1'].mean()
        for m in metrics
    ],
    'Experimental_Delta': [
        experimental_group[f'{m}_T2_Result'].mean() - experimental_group[f'{m}_T1_Result'].mean()
        if f'{m}_T2_Result' in experimental_group.columns else
        experimental_group[f'{m}_T2'].mean() - experimental_group[f'{m}_T1'].mean()
        for m in metrics
    ]
})

delta_table

# Анализ эффекта эксперимента (по необходимости)
paired_variables = [
    ('SUS_T1_Result', 'SUS_T2_Result'),
    ('Gallup_T1_Result', 'Gallup_T2_Result'),
    ('MSQ_T1_Result', 'MSQ_T2_Result'),
    ('Autonomy_T1', 'Autonomy_T2'),
    ('Competence_T1', 'Competence_T2'),
    ('Relatedness_T1', 'Relatedness_T2')
]

# Создаем дельты (разницы T2 - T1)
for t1, t2 in paired_variables:
    base_name = t1.split("_T1")[0]
    data2[f'delta_{base_name}'] = data2[t2] - data2[t1]

# Повторное определение групп с новыми столбцами
control_group = data2[data2["Group"] == "control"]
experimental_group = data2[data2["Group"] == "experimental"]

# Анализ
results = {}
for delta in [f'delta_{var[0].split("_T1")[0]}' for var in paired_variables]:
    # Проверка нормальности
    p_control = stats.shapiro(control_group[delta].dropna()).pvalue
    p_experimental = stats.shapiro(experimental_group[delta].dropna()).pvalue

    if p_control > 0.05 and p_experimental > 0.05:
        test_stat, p_value = stats.ttest_ind(
            control_group[delta].dropna(), experimental_group[delta].dropna(), equal_var=False)
        test_used = 't-test'
    else:
        test_stat, p_value = stats.mannwhitneyu(
            control_group[delta].dropna(), experimental_group[delta].dropna(), alternative='two-sided')
        test_used = 'Mann-Whitney U'

    results[delta] = {'Test': test_used, 'p-value': p_value}

# Вывод результатов
for metric, res in results.items():
    print(f"{metric}: {res['Test']} (p = {res['p-value']:.5f})")
