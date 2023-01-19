project('aoc', 'c')

src = [
	'src/aoc.c',
	'src/01.c',
	'src/02.c',
	'src/03.c',
	'src/04.c',
	'src/05.c'
]

deps = [
	subproject('c-vector').get_variable('main_dep'),
	subproject('getopt').get_variable('main_dep'),
	subproject('sds').get_variable('main_dep')
]

inc = include_directories('include')

args = [
	'-DINPUT_PATH="' + meson.source_root() + '/"'
]

executable('aoc', src, dependencies: deps, include_directories: inc, c_args: args)