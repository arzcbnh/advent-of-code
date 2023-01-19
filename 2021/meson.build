project('aoc', 'c')

inc = include_directories('include')

src = [
	'src/aoc.c',
	'src/01.c',
	'src/02.c',
	'src/03.c',
	'src/04.c'
]

deps = [
	subproject('c-vector').get_variable('main_dep'),
	subproject('getopt').get_variable('main_dep'),
	subproject('sds').get_variable('main_dep')
]

executable('aoc', src, dependencies: deps, include_directories: inc)