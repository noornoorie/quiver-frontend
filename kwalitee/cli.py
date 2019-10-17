import click
from ocrd.decorators import ocrd_loglevel
from ocrd_utils import getLogger
from yaml import safe_load
import json
from pkg_resources import resource_filename

from .repo import Repo

LOG = getLogger('kwalitee.cli')

class CliCtx():
    def __init__(self, config_file):
        with open(config_file, 'r') as f_config_file:
            self.config = safe_load(f_config_file.read())
            self.repos = [Repo(self.config, url) for url in self.config['repolist']]
pass_ctx = click.make_pass_decorator(CliCtx)

@click.group()
@click.option('-c', '--config-file', help="", default=resource_filename(__name__, 'config.yml'))
@ocrd_loglevel
@click.pass_context
def cli(ctx, config_file, **kwargs): # pylint: disable=unused-argument
    ctx.obj = CliCtx(config_file)

@cli.command('json', help='''

    Generate JSON

''')
@pass_ctx
@click.option('-a', '--full', help="Set all flags", is_flag=True, default=False)
@click.option('-g', '--git', help="Git stats", is_flag=True, default=False)
@click.option('-p', '--python', help="Python stats", is_flag=True, default=False)
@click.option('-f', '--files', help="Files", is_flag=True, default=False)
def generate_json(ctx, full, **kwargs):
    ret = []
    if full:
        for k in kwargs:
            kwargs[k] = True
    for repo in ctx.repos:
        LOG.info("# Assessing %s" % repo.name)
        repo.clone()
        ret.append(repo.to_json(**kwargs))
        #  print('%s %s -> %s' % (repo.path.is_dir(), repo.url, repo.path))
    print(json.dumps(ret))
