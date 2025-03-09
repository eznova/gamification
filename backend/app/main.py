from flask import Flask, jsonify
from config import SYSTEM_COMPANY_ID 
from flasgger import Swagger
from flask_cors import CORS
import users, stats, auth, photo, news, thx, achievments, tasks, store, mems, rules, roles

# Инициализация Flask-приложения
app = Flask(__name__)
CORS(app)
swagger = Swagger(app)

################################## USER ENDPOINTS ##################################
# Получение id пользователя
@app.route('/users/get/id', methods=['POST'])
def get_user_id(): return users.get_user_id()

# Получение персональных данных пользователя
@app.route('/users/get/<int:user_id>/personal', methods=['GET'])
def get_user_personal(user_id): return users.get_user_personal(user_id)

# Получение должностей и департамента пользователя
@app.route('/users/get/<int:user_id>/job_info', methods=['GET'])
def get_user_job_titles_and_departments(user_id): return users.get_user_job_titles_and_departments(user_id)

# Получение ncoins и рейтинга пользователя
@app.route('/users/get/<int:user_id>/details', methods=['GET'])
def get_user_details(user_id): return users.get_user_details(user_id)

# Получение фото пользователя
@app.route('/users/get/<int:user_id>/photo', methods=['GET'])
def get_user_photo(user_id): return photo.get_user_photo(user_id)

# Загрузка фото пользователя
@app.route('/users/upload/<int:user_id>/photo', methods=['POST'])
def upload_photo(user_id): return photo.upload_photo(user_id)

@app.route('/users/get/all', methods=['GET'])
def get_all_users(): return users.get_all_users()

# Получение команды пользователя
@app.route('/users/get/<int:user_id>/team', methods=['GET'])
def get_user_team_members(user_id): return users.get_user_team_members(user_id)

# Получение департамента пользователя
@app.route('/users/get/departments', methods=['GET'])
def get_departments(): return users.get_departments()


@app.route('/users/get/<int:user_id>/roles', methods=['GET'])
def get_user_roles(user_id): return users.get_user_roles(user_id)

@app.route('/users/get/<int:user_id>/available_roles', methods=['GET'])
def get_user_available_roles(user_id): return users.get_user_available_roles(user_id)

@app.route('/users/add/role', methods=['POST'])
def add_user_role(): return users.add_user_role()

@app.route('/users/remove/role', methods=['POST'])
def remove_user_role(): return users.remove_user_role()

@app.route('/roles/get', methods=['GET'])
def get_roles(): return users.get_roles()

################################## STATS ENDPOINTS ##################################
# Получение ранга пользователя
@app.route('/users/get/<int:user_id>/rank', methods=['GET'])
def get_user_rank(user_id): return stats.get_user_rank(user_id)

# Получение топ-10 пользователей
@app.route('/users/get/top10', methods=['GET'])
def get_top10_users(): return stats.get_top10_users()

# Получение дней рождения пользователей по месяцу
@app.route('/users/get/bdays/<int:month>/', methods=['GET'])
def get_birthdays(month): return stats.get_birthdays(month)

################################## AUTH ENDPOINTS ##################################
# Логин пользователя
@app.route('/login', methods=['PUT'])
def login(): return auth.login()

# Регистрация пользователя
@app.route('/users/register', methods=['POST'])
def register(): return auth.register()

@app.route('/users/codes', methods=['GET'])
def get_codes(): return auth.get_codes()

@app.route('/users/codes/add', methods=['GET'])
def add_codes(): return auth.add_codes()

@app.route('/users/tg/get_token', methods=['POST'])
def user_id_to_token(): return auth.user_id_to_token()

@app.route('/users/tg/set_token', methods=['POST'])
def link_tg(): return auth.link_tg()

################################## SYSTEM ENDPOINTS ##################################
# Получение ID системы
@app.route('/system/get/id', methods=['GET'])
def get_system_id(): return jsonify(SYSTEM_COMPANY_ID), 200

################################## NEWS ENDPOINTS ##################################
# Получение новостей
@app.route('/news/get', methods=['GET'])
def get_news(): return news.get_news()

# Добавление новости
@app.route('/news/add', methods=['POST'])
def add_news(): return news.add_news()

# Лайк новости
@app.route('/news/like/<int:news_id>/<int:user_id>', methods=['POST'])
def like_news(news_id, user_id): return news.like_news(news_id, user_id)

# Удаление лайка с новости
@app.route('/news/unlike/<int:news_id>/<int:user_id>', methods=['POST'])
def unlike_news(news_id, user_id): return news.unlike_news(news_id, user_id)

# Получение новостей, которые лайкнул пользователь
@app.route('/news/liked_by_user/<int:user_id>', methods=['GET'])
def get_user_liked_news(user_id): return news.get_user_liked_news(user_id)

# Удаление новости
@app.route('/news/remove/<int:news_id>', methods=['DELETE'])
def remove_news(news_id): return news.remove_news(news_id)

#################################### THANKS ENDPOINTS ##################################
@app.route('/thx', methods=['POST'])
def add_thx(): return thx.add_thx()

@app.route('/thx/get/<int:user_id>', methods=['GET'])
def get_user_thx(user_id): return thx.get_user_thx(user_id)

@app.route('/thx/reset', methods=['GET'])
def reset_thx(): return thx.reset_thx()

@app.route('/thx/get/<int:user_id>/details', methods=['GET'])
def get_user_thx_details(user_id): return thx.get_user_thx_details(user_id)

################################### ACHIEVEMENT ENDPOINTS ##################################
@app.route('/achievments/get/all', methods=['GET'])
def get_all_achievements(): return achievments.get_all_achievements()

@app.route('/achievements/get/<int:user_id>', methods=['GET'])
def get_user_achievements(user_id): return achievments.get_user_achievements(user_id)

@app.route('/achievements/add', methods=['POST'])
def add_achievement(): return achievments.add_achievement()

@app.route('/achievments/send', methods=['POST'])
def send_achievement(): return achievments.send_achievement()

@app.route('/achievments/unverified', methods=['GET'])
def get_unverified_achievements(): return achievments.get_unverified_achievements()

@app.route('/achievments/verify', methods=['POST'])
def verify_achievement(): return achievments.verify_achievement()

################################# TASKS ENDPOINTS ##################################
@app.route('/tasks/get', methods=['POST'])
def get_season_tasks(): return tasks.get_season_tasks()

@app.route('/tasks/add/result', methods=['POST'])
def add_task_result(): return tasks.add_task_result()

@app.route('/tasks/get/moderation', methods=['GET'])
def get_tasks_for_moderation(): return tasks.get_tasks_for_moderation()

@app.route('/tasks/moderation', methods=['POST'])
def moderate_quest(): return tasks.moderate_quest()


################################# STORE ENDPOINTS ##################################
@app.route('/store/items', methods=['GET'])
def get_all_items(): return store.get_all_items()

@app.route('/store/buy', methods=['POST'])
def buy_cart(): return store.buy_cart()

################################## MEMS ENDPOINTS ##################################
@app.route('/mems/get/<int:user_id>', methods=['GET'])
def get_mems(user_id): return mems.get_mems(user_id)

@app.route('/mems/get/image/<int:mem_id>', methods=['GET'])
def get_mem_image(mem_id): return mems.get_mem_image(mem_id)

@app.route('/mems/get/best', methods=['GET'])
def get_best_mem(): return mems.get_best_mem()

@app.route('/mems/add', methods=['POST'])
def add_mems(): return mems.add_mem()

@app.route('/mems/rate', methods=['POST'])
def rate_mem(): return mems.rate_mem()

@app.route('/mems/moderate', methods=['GET'])
def get_unmod_mems(): return mems.get_unmod_mems()

@app.route('/mems/moderate/', methods=['POST'])
def moderate_mem(): return mems.moderate_mem()

################################### RULES ENDPOINTS ##################################
@app.route('/rules', methods=['GET'])
def get_rules(): return rules.get_rules()

################################## ROLE ENDPOINTS ##################################
@app.route('/roles/get/max_balance', methods=['GET'])
def get_max_balance(): return roles.get_max_balance()


@app.route('/roles/get/<int:user_id>/wallet', methods=['GET'])
def get_user_wallet(user_id): return roles.get_user_wallet(user_id)

# Запуск сервера
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
