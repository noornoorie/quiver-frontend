from pathlib import Path
import json
from subprocess import run
from ocrd_utils import pushd_popd, getLogger

LOG = getLogger('kwalitee.repo')

class Repo():

    def __init__(self, config, url):
        self.url = url
        self.config = config
        self.name = Path(url).name
        self.path = Path(self.config['repodir'], self.name)
        self.ocrd_tool_path = Path(self.path, 'ocrd-tool.json')

    def clone(self):
        if self.path.is_dir():
            LOG.debug("Already cloned: %s" % self.path)
            return
        with pushd_popd(self.config['repodir']):
            LOG.debug("Cloning %s" % self.url)
            result = run('git clone --depth 1'.split(' ') + [self.url])
            LOG.debug("Result: %s" % result)

    def has_ocrd_tool_json(self):
        return self.ocrd_tool_path.is_file()

    def get_ocrd_tool_json(self):
        return json.load(self.ocrd_tool_path)
