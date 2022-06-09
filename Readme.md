To work on the sample code, you'll need to clone project's repository to your local computer. If you haven't, do that first.

github repo :

git clone

# money-control

[1] For Backend:-

    1)Create a Python virtual environment for your Django project. This virtual environment allows you to isolate this project and install any packages you need
    without affecting the system Python installation. At the terminal, type the following command:

	$ python3 -m venv env

    2)Activate the virtual environment:

        $ env\Scripts\activate

    3)Install Python dependencies for this project:

        $ pip install -r requirements.txt

    4)For Database schema:

        $ python manage.py migrate

    5)Create Super User

        $ python manage.py createsupersuer

    6)Create other users by login to admin dashboard

        $localhost:8000/admin
    
    7)Start the Django development server:

        $ python manage.py runserver



[2] For Frontend:-

    1)install nodejs in your machine

    2)open terminal and go to project directory and then go to frontend 

    3)Install Reactjs dependencies for this project:

        $ npm install

    4)For run reactjs:

        $ npm start

    "# Money-Control" 
