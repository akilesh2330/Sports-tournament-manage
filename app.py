import os
from datetime import datetime
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Ensure instance folder exists for SQLite db
os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)

db = SQLAlchemy(app)

# =========================================================
# Database Models
# =========================================================

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # 'admin' or 'user'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    teams = db.relationship('Team', backref='owner', lazy=True, cascade="all, delete-orphan")


class Tournament(db.Model):
    __tablename__ = 'tournaments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    sport = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    max_teams = db.Column(db.Integer, nullable=False, default=8)
    status = db.Column(db.String(20), nullable=False, default='Upcoming')  # 'Upcoming', 'Ongoing', 'Completed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    registrations = db.relationship('Registration', backref='tournament', lazy=True, cascade="all, delete-orphan")
    matches = db.relationship('Match', backref='tournament', lazy=True, cascade="all, delete-orphan")


class Team(db.Model):
    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(100), nullable=False)
    captain = db.Column(db.String(100), nullable=False)
    sport = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    registrations = db.relationship('Registration', backref='team', lazy=True, cascade="all, delete-orphan")


class Registration(db.Model):
    __tablename__ = 'registrations'
    id = db.Column(db.Integer, primary_key=True)
    tournament_id = db.Column(db.Integer, db.ForeignKey('tournaments.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Pending')  # 'Pending', 'Approved', 'Rejected'
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)


class Match(db.Model):
    __tablename__ = 'matches'
    id = db.Column(db.Integer, primary_key=True)
    tournament_id = db.Column(db.Integer, db.ForeignKey('tournaments.id'), nullable=False)
    team1_id = db.Column(db.Integer, db.ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    team2_id = db.Column(db.Integer, db.ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    match_date = db.Column(db.Date, nullable=False)
    match_time = db.Column(db.String(20), nullable=False)
    venue = db.Column(db.String(150), nullable=False)
    score1 = db.Column(db.Integer, default=0)
    score2 = db.Column(db.Integer, default=0)
    winner_id = db.Column(db.Integer, db.ForeignKey('teams.id', ondelete='SET NULL'), nullable=True)
    status = db.Column(db.String(20), nullable=False, default='Upcoming')  # 'Upcoming', 'Live', 'Completed'
    stream_url = db.Column(db.String(255), nullable=True)
    round_number = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    team1 = db.relationship('Team', foreign_keys=[team1_id])
    team2 = db.relationship('Team', foreign_keys=[team2_id])
    winner = db.relationship('Team', foreign_keys=[winner_id])


# =========================================================
# Authentication Decorators & Helpers
# =========================================================

def get_current_user():
    if 'user_id' in session:
        return User.query.get(session['user_id'])
    return None

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user or user.role != 'admin':
            flash('Access restricted to Administrators only.', 'danger')
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function

@app.context_processor
def inject_user():
    return dict(current_user=get_current_user())


# =========================================================
# Routes
# =========================================================

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))


# --- Auth Routes ---

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        if not name or not email or not password:
            flash('All fields are required.', 'danger')
            return redirect(url_for('register'))

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('An account with this email already exists.', 'warning')
            return redirect(url_for('register'))

        hashed_pw = generate_password_hash(password)
        new_user = User(name=name, email=email, password=hashed_pw, role='user')
        db.session.add(new_user)
        db.session.commit()

        flash('Registration successful! You can now log in.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['user_name'] = user.name
            session['user_role'] = user.role
            flash(f'Welcome back, {user.name}!', 'success')
            return redirect(url_for('dashboard'))

        flash('Invalid email or password. Please try again.', 'danger')
        return redirect(url_for('login'))

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))


# --- Dashboard ---

@app.route('/dashboard')
@login_required
def dashboard():
    total_tournaments = Tournament.query.count()
    total_teams = Team.query.count()
    upcoming_matches = Match.query.filter(Match.status.in_(['Upcoming', 'Live'])).count()
    completed_matches = Match.query.filter_by(status='Completed').count()

    recent_tournaments = Tournament.query.order_by(Tournament.created_at.desc()).limit(5).all()
    upcoming_match_list = Match.query.filter(Match.status.in_(['Upcoming', 'Live'])).order_by(Match.match_date.asc()).limit(5).all()

    return render_template('dashboard.html',
                           total_tournaments=total_tournaments,
                           total_teams=total_teams,
                           upcoming_matches=upcoming_matches,
                           completed_matches=completed_matches,
                           recent_tournaments=recent_tournaments,
                           upcoming_match_list=upcoming_match_list)


# --- Tournaments Management ---

@app.route('/tournaments')
@login_required
def tournaments():
    status_filter = request.args.get('status')
    if status_filter:
        tournaments_list = Tournament.query.filter_by(status=status_filter).order_by(Tournament.start_date.asc()).all()
    else:
        tournaments_list = Tournament.query.order_by(Tournament.start_date.asc()).all()
    
    return render_template('tournaments.html', tournaments=tournaments_list, current_filter=status_filter)


@app.route('/tournaments/create', methods=['GET', 'POST'])
@login_required
@admin_required
def create_tournament():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        sport = request.form.get('sport', '').strip()
        location = request.form.get('location', '').strip()
        start_date_str = request.form.get('start_date')
        end_date_str = request.form.get('end_date')
        max_teams = int(request.form.get('max_teams', 8))
        status = request.form.get('status', 'Upcoming')

        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            flash('Invalid date format provided.', 'danger')
            return redirect(url_for('create_tournament'))

        new_t = Tournament(
            name=name, sport=sport, location=location,
            start_date=start_date, end_date=end_date,
            max_teams=max_teams, status=status
        )
        db.session.add(new_t)
        db.session.commit()
        flash('Tournament created successfully!', 'success')
        return redirect(url_for('tournaments'))

    return render_template('tournament_form.html', action='Create', tournament=None)


@app.route('/tournaments/<int:id>/edit', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_tournament(id):
    tournament = Tournament.query.get_or_404(id)
    if request.method == 'POST':
        tournament.name = request.form.get('name', '').strip()
        tournament.sport = request.form.get('sport', '').strip()
        tournament.location = request.form.get('location', '').strip()
        start_date_str = request.form.get('start_date')
        end_date_str = request.form.get('end_date')
        tournament.max_teams = int(request.form.get('max_teams', 8))
        tournament.status = request.form.get('status', 'Upcoming')

        try:
            tournament.start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            tournament.end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            flash('Invalid date format provided.', 'danger')
            return redirect(url_for('edit_tournament', id=id))

        db.session.commit()
        flash('Tournament details updated!', 'success')
        return redirect(url_for('tournament_details', id=id))

    return render_template('tournament_form.html', action='Edit', tournament=tournament)


@app.route('/tournaments/<int:id>/delete', methods=['POST'])
@login_required
@admin_required
def delete_tournament(id):
    tournament = Tournament.query.get_or_404(id)
    db.session.delete(tournament)
    db.session.commit()
    flash('Tournament removed successfully.', 'info')
    return redirect(url_for('tournaments'))


@app.route('/tournaments/<int:id>')
@login_required
def tournament_details(id):
    tournament = Tournament.query.get_or_404(id)
    approved_registrations = Registration.query.filter_by(tournament_id=id, status='Approved').all()
    all_registrations = Registration.query.filter_by(tournament_id=id).all()
    matches = Match.query.filter_by(tournament_id=id).order_by(Match.match_date.asc(), Match.match_time.asc()).all()

    user = get_current_user()
    user_teams = Team.query.filter_by(user_id=user.id).all() if user else []

    # Identify user's team registration status for this tournament
    registered_team_ids = [reg.team_id for reg in all_registrations]

    return render_template('tournament_details.html',
                           tournament=tournament,
                           approved_registrations=approved_registrations,
                           all_registrations=all_registrations,
                           matches=matches,
                           user_teams=user_teams,
                           registered_team_ids=registered_team_ids)


# --- Teams Management ---

@app.route('/teams')
@login_required
def teams():
    user = get_current_user()
    if user.role == 'admin':
        teams_list = Team.query.all()
    else:
        teams_list = Team.query.filter_by(user_id=user.id).all()

    return render_template('teams.html', teams=teams_list)


@app.route('/teams/create', methods=['GET', 'POST'])
@login_required
def create_team():
    if request.method == 'POST':
        team_name = request.form.get('team_name', '').strip()
        captain = request.form.get('captain', '').strip()
        sport = request.form.get('sport', '').strip()

        if not team_name or not captain or not sport:
            flash('All team fields are required.', 'danger')
            return redirect(url_for('create_team'))

        user = get_current_user()
        new_team = Team(team_name=team_name, captain=captain, sport=sport, user_id=user.id)
        db.session.add(new_team)
        db.session.commit()

        flash(f'Team "{team_name}" created successfully!', 'success')
        return redirect(url_for('teams'))

    return render_template('team_form.html')


@app.route('/teams/<int:id>/delete', methods=['POST'])
@login_required
def delete_team(id):
    team = Team.query.get_or_404(id)
    user = get_current_user()

    if user.role != 'admin' and team.user_id != user.id:
        flash('Permission denied.', 'danger')
        return redirect(url_for('teams'))

    db.session.delete(team)
    db.session.commit()
    flash(f'Team "{team.team_name}" deleted.', 'info')
    return redirect(url_for('teams'))


# --- Registrations ---

@app.route('/tournaments/<int:tournament_id>/register', methods=['POST'])
@login_required
def register_team_for_tournament(tournament_id):
    team_id = request.form.get('team_id')
    if not team_id:
        flash('Please select a team to register.', 'warning')
        return redirect(url_for('tournament_details', id=tournament_id))

    existing = Registration.query.filter_by(tournament_id=tournament_id, team_id=team_id).first()
    if existing:
        flash('This team is already registered for this tournament.', 'info')
        return redirect(url_for('tournament_details', id=tournament_id))

    new_reg = Registration(tournament_id=tournament_id, team_id=team_id, status='Pending')
    db.session.add(new_reg)
    db.session.commit()

    flash('Registration submitted! Awaiting administrator approval.', 'success')
    return redirect(url_for('tournament_details', id=tournament_id))


@app.route('/registrations')
@login_required
@admin_required
def registrations():
    pending_regs = Registration.query.filter_by(status='Pending').all()
    all_regs = Registration.query.order_by(Registration.registered_at.desc()).all()
    return render_template('registrations.html', pending_regs=pending_regs, all_regs=all_regs)


@app.route('/registrations/<int:id>/<action>', methods=['POST'])
@login_required
@admin_required
def process_registration(id, action):
    reg = Registration.query.get_or_404(id)
    if action == 'approve':
        reg.status = 'Approved'
        flash(f'Registration for "{reg.team.team_name}" approved!', 'success')
    elif action == 'reject':
        reg.status = 'Rejected'
        flash(f'Registration for "{reg.team.team_name}" rejected.', 'warning')

    db.session.commit()
    return redirect(request.referrer or url_for('registrations'))


# --- Matches & Results ---

@app.route('/matches')
@login_required
def matches():
    tournaments = Tournament.query.all()
    selected_t_id = request.args.get('tournament_id', type=int)

    if selected_t_id:
        match_list = Match.query.filter_by(tournament_id=selected_t_id).order_by(Match.match_date.asc(), Match.match_time.asc()).all()
    else:
        match_list = Match.query.order_by(Match.match_date.asc(), Match.match_time.asc()).all()

    return render_template('matches.html', matches=match_list, tournaments=tournaments, selected_t_id=selected_t_id)


@app.route('/matches/create', methods=['GET', 'POST'])
@login_required
@admin_required
def create_match():
    if request.method == 'POST':
        tournament_id = request.form.get('tournament_id')
        team1_id = request.form.get('team1_id')
        team2_id = request.form.get('team2_id')
        match_date_str = request.form.get('match_date')
        match_time = request.form.get('match_time')
        venue = request.form.get('venue')
        stream_url = request.form.get('stream_url', '').strip()
        round_number = int(request.form.get('round_number', 1))

        if team1_id == team2_id:
            flash('Team 1 and Team 2 must be different teams.', 'danger')
            return redirect(url_for('create_match'))

        try:
            match_date = datetime.strptime(match_date_str, '%Y-%m-%d').date()
        except ValueError:
            flash('Invalid match date format.', 'danger')
            return redirect(url_for('create_match'))

        new_match = Match(
            tournament_id=tournament_id,
            team1_id=team1_id,
            team2_id=team2_id,
            match_date=match_date,
            match_time=match_time,
            venue=venue,
            stream_url=stream_url if stream_url else None,
            round_number=round_number,
            status='Upcoming'
        )
        db.session.add(new_match)
        db.session.commit()

        flash('Match scheduled successfully!', 'success')
        return redirect(url_for('matches'))

    tournaments = Tournament.query.all()
    teams = Team.query.all()
    return render_template('match_form.html', tournaments=tournaments, teams=teams)


@app.route('/matches/<int:id>/score', methods=['POST'])
@login_required
@admin_required
def record_score(id):
    match = Match.query.get_or_404(id)
    score1 = int(request.form.get('score1', 0))
    score2 = int(request.form.get('score2', 0))
    status = request.form.get('status', 'Completed')

    match.score1 = score1
    match.score2 = score2
    match.status = status

    if score1 > score2:
        match.winner_id = match.team1_id
    elif score2 > score1:
        match.winner_id = match.team2_id
    else:
        match.winner_id = None  # Draw / Tied

    db.session.commit()
    flash('Match score updated successfully!', 'success')
    return redirect(url_for('matches'))


@app.route('/results')
@login_required
def results():
    completed_matches = Match.query.filter_by(status='Completed').order_by(Match.match_date.desc()).all()
    return render_template('results.html', matches=completed_matches)


# --- Bracket Visualizer ---

@app.route('/tournaments/<int:id>/bracket')
@login_required
def bracket(id):
    tournament = Tournament.query.get_or_404(id)
    approved_regs = Registration.query.filter_by(tournament_id=id, status='Approved').all()
    teams = [reg.team for reg in approved_regs]

    matches = Match.query.filter_by(tournament_id=id).order_by(Match.round_number.asc(), Match.id.asc()).all()

    # Group matches by round_number
    rounds = {}
    for match in matches:
        rounds.setdefault(match.round_number, []).append(match)

    return render_template('bracket.html', tournament=tournament, teams=teams, rounds=rounds)


# =========================================================
# Seed Initial Database Data
# =========================================================

def seed_initial_data():
    with app.app_context():
        db.create_all()

        if User.query.first() is None:
            admin = User(
                name='Admin Controller',
                email='admin@tournament.com',
                password=generate_password_hash('admin123'),
                role='admin'
            )
            user1 = User(
                name='Akil Captain',
                email='user@tournament.com',
                password=generate_password_hash('user123'),
                role='user'
            )
            user2 = User(
                name='John Smith',
                email='john@tournament.com',
                password=generate_password_hash('user123'),
                role='user'
            )
            user3 = User(
                name='Sarah Connor',
                email='sarah@tournament.com',
                password=generate_password_hash('user123'),
                role='user'
            )
            db.session.add_all([admin, user1, user2, user3])
            db.session.commit()

            t1 = Tournament(
                name='College Football Championship',
                sport='Football',
                location='Main Sports Complex Arena',
                start_date=datetime.strptime('2026-09-01', '%Y-%m-%d').date(),
                end_date=datetime.strptime('2026-09-10', '%Y-%m-%d').date(),
                max_teams=8,
                status='Upcoming'
            )
            t2 = Tournament(
                name='Inter College Cricket Cup',
                sport='Cricket',
                location='University Oval Field',
                start_date=datetime.strptime('2026-08-25', '%Y-%m-%d').date(),
                end_date=datetime.strptime('2026-09-05', '%Y-%m-%d').date(),
                max_teams=8,
                status='Ongoing'
            )
            t3 = Tournament(
                name='E-Sports Championship',
                sport='Valorant / Gaming',
                location='Student Union Tech Lounge',
                start_date=datetime.strptime('2026-08-10', '%Y-%m-%d').date(),
                end_date=datetime.strptime('2026-08-15', '%Y-%m-%d').date(),
                max_teams=4,
                status='Completed'
            )
            db.session.add_all([t1, t2, t3])
            db.session.commit()

            team1 = Team(team_name='Thunder Strikers', captain='Akil Captain', sport='Football', user_id=user1.id)
            team2 = Team(team_name='Cyber Warriors', captain='Akil Captain', sport='Valorant / Gaming', user_id=user1.id)
            team3 = Team(team_name='Titan Strikers', captain='John Smith', sport='Football', user_id=user2.id)
            team4 = Team(team_name='Phoenix Knights', captain='Sarah Connor', sport='Cricket', user_id=user3.id)
            db.session.add_all([team1, team2, team3, team4])
            db.session.commit()

            reg1 = Registration(tournament_id=t1.id, team_id=team1.id, status='Approved')
            reg2 = Registration(tournament_id=t1.id, team_id=team3.id, status='Approved')
            reg3 = Registration(tournament_id=t2.id, team_id=team4.id, status='Approved')
            reg4 = Registration(tournament_id=t3.id, team_id=team2.id, status='Approved')
            db.session.add_all([reg1, reg2, reg3, reg4])
            db.session.commit()

            m1 = Match(
                tournament_id=t1.id,
                team1_id=team1.id,
                team2_id=team3.id,
                match_date=datetime.strptime('2026-09-02', '%Y-%m-%d').date(),
                match_time='15:00',
                venue='Stadium Court A',
                status='Upcoming',
                stream_url='https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                round_number=1
            )
            m2 = Match(
                tournament_id=t3.id,
                team1_id=team2.id,
                team2_id=team2.id,
                match_date=datetime.strptime('2026-08-12', '%Y-%m-%d').date(),
                match_time='18:00',
                venue='Tech Arena Center',
                score1=2,
                score2=1,
                winner_id=team2.id,
                status='Completed',
                stream_url='https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                round_number=1
            )
            db.session.add_all([m1, m2])
            db.session.commit()
            print("Database initialized and seeded successfully.")


if __name__ == '__main__':
    seed_initial_data()
    app.run(debug=True, port=5000)
