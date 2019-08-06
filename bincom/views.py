from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db.models import Sum
from django.contrib import messages

from bincom.models import *  # import all models in file


# Create your views here.
def fetchStateData(state_id):
    ''' fetch all state related data '''
    state = States.objects.filter(state_id=state_id)
    if state.exists():
        lga_list = Lga.objects.filter(state_id=state[0].state_id)  # assumes just one state in table- Delta
        ward_list = Ward.objects.filter(lga_id__in=lga_list.values('lga_id'))
        pu_list = PollingUnit.objects.filter(ward_id__in=ward_list.values('ward_id'))
        return {'state': state, 'lga_list': lga_list, 'ward_list': ward_list, 'polling_units': pu_list}
    return {}


def get_party_abbrev(party_name):
    ''' get party name abbreviation '''
    party_abbrev = party_name
    if len(party_name) > 4:
        party_abbrev = party_name[:4]
    return party_abbrev


def indexView(request):
    return render(request, 'bt_main/index.html', {'show_form': False})


def puResultsView(request):
    ''' fetch result for individual polling unit'''
    state_info = fetchStateData(25)  # Delta state's state_id
    states = state_info.get('state', '')
    lga_list = state_info.get('lga_list', '')
    ward_list = state_info.get('ward_list', '')
    pu_list = state_info.get('polling_units', '')
    context = {'states': states, 'lga_list': lga_list, 'ward_list': ward_list,
               'polling_units': pu_list, 'action_type': 'unit',
               'inset_template': 'snippets/unit_form.html', 'show_form': True}
    if request.method == "POST":
        unit_id = request.POST['unit']
        polling_unit = PollingUnit.objects.filter(uniqueid=unit_id)[0]
        poll_results = AnnouncedPuResults.objects.filter(polling_unit_uniqueid=unit_id)
        context.update({'unit_results': poll_results, 'unit': polling_unit})
    else:
        return render(request, 'bt_main/index.html', context)
    return render(request, 'bt_main/index.html', context)


def lgaSummaryView(request):
    ''' fetch local government summary '''
    state_info = fetchStateData(25)
    lga_list = state_info.get('lga_list')
    party_list = Party.objects.all()
    party_summary_list = []
    context = {'action_type': 'lga_summary', 'lga_list': lga_list,
               'states': state_info.get('state', ""), 'parties': party_list,
               'inset_template': 'snippets/lga_summary_form.html', 'show_form': True}
    lga_score_dict = {}
    if request.method == "POST":
        rp = request.POST
        lga_id = rp.get('lga_id')
        lga_name = Lga.objects.get(uniqueid=lga_id).lga_name
        polling_units = PollingUnit.objects.filter(lga_id=lga_id)  # fetch all units in selected LGA

        for unit in polling_units:
            lga_score_dict[unit] = AnnouncedPuResults.objects.filter(
                polling_unit_uniqueid=unit.uniqueid)  # fet scores for each units

        for party in party_list:
            party_abbrev = get_party_abbrev(party.partyname)
            party_total_score = AnnouncedPuResults.objects.filter(party_abbreviation=party_abbrev,
                                                                  polling_unit_uniqueid__in=polling_units.values(
                                                                      'uniqueid')).aggregate(Sum('party_score'))[
                'party_score__sum']

            party_summary_list.append(party_total_score)
        context.update(
            {'lga_score_dict': lga_score_dict, 'lga_name': lga_name, 'party_summary_list': party_summary_list})

    return render(request, 'bt_main/index.html', context)


def addNewScoreView(request):
    context = {'inset_template': 'snippets/add_new_score.html', 'show_form': True}
    state_info = fetchStateData(25)
    party_list = Party.objects.all()
    polling_units = state_info.get('polling_units')
    exclusion_list = ['csrfmiddlewaretoken', 'unit', 'submit']
    new_record = None
    if request.method == "POST":
        rp = request.POST
        for key in rp:
            if key not in exclusion_list and rp[key] != "":
                party_abbrev = get_party_abbrev(key)
                # create new polling unit score record
                new_record = AnnouncedPuResults.objects.get_or_create(polling_unit_uniqueid=rp['unit'],
                                                                      party_abbreviation=party_abbrev,
                                                                      party_score=rp[key],
                                                                      entered_by_user="annonymous",
                                                                      user_ip_address="168.192.4.55")
        if not new_record == None:
            messages.success(request, "New poll record saved!")
        else:
            messages.error(request, "Result nit saved, please try again")
    context.update({'polling_units': polling_units, 'parties': party_list, 'action_type': 'add_score'})
    return render(request, 'bt_main/index.html', context)
