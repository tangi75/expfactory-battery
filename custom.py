# this file imports custom routes into the experiment server

from flask import Blueprint, render_template, request, jsonify, Response, abort, current_app
from jinja2 import TemplateNotFound
from functools import wraps
from sqlalchemy import or_, and_, Column, Integer, String, DateTime, Boolean, Float, Text, func
from sqlalchemy.orm import aliased

import random
import os
import numpy
from sys import exit

from psiturk.psiturk_config import PsiturkConfig
from psiturk.experiment_errors import ExperimentError
from psiturk.user_utils import PsiTurkAuthorization, nocache

# # Database setup
from psiturk.db import Base, db_session, init_db
from psiturk.models import Participant
from json import dumps, loads

# load the configuration options
config = PsiturkConfig()
config.load_config()

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__, template_folder='templates', static_folder='static')
#----------------------------------------------
# route to reload stimuli
# the javascript client will make a request to
# this route whenever it doesn't know what
# stimulus to display next.
#----------------------------------------------
# Get request from javascript, using participant unique id
# to check whether participant done any trials yet. If not, grab
# stimuli using call to get_exp_trials() and return jsonify'ed results
# to javascript.
# Note that using the sql calls and computing which trials etc is particular to
# this experiment.
        
        
@custom_code.route('/get_stims', methods=['GET'])
def get_stims():
    # check that user provided the correct keys
    # errors will not be that gracefull here if being
    # accessed by the Javascrip client
    if not request.args.has_key('uniqueId'):
        abort(400)
    uniqueId = request.args['uniqueId']

    try:

        total_trials = 0  # for demo sake just counting number of trials the user has completed so far
        # lookup user in database
        user = Participant.query.\
                filter(Participant.uniqueid == uniqueId).\
                one()
        user_data = loads(user.datastring) # load datastring from JSON
        for record in user_data['data']: # for line in data file
            trial = record['trialdata']
            if trial['phase'] == 'TEST': # if trial is a learning trial (e.g., not instructions)
                 total_trials += 1  

        current_app.logger.info(total_trials)
        if total_trials==0:
            trialset = get_exp_trials(uniqueId, 5, 20)
            return jsonify(results=trialset)
        else:
            return jsonify(results="done")
    except:
        abort(404)


